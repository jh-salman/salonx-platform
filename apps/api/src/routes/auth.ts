import { Router, type Router as ExpressRouter } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '@repo/db';
import { profiles, orgs } from '@repo/db/schema';
import { eq } from 'drizzle-orm';
import { validateBody } from '../middleware/validation.js';
import { env } from '@repo/config/env';

const router: ExpressRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  orgName: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const { email, password, firstName, lastName, orgName } = req.body;

    const existingUser = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const tempOrgId = crypto.randomUUID();
    
    const newUser = await db
      .insert(profiles)
      .values({
        orgId: tempOrgId,
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'owner',
      })
      .returning();

    let orgId: string;
    if (orgName) {
      const newOrg = await db
        .insert(orgs)
        .values({
          name: orgName,
          slug: orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          ownerId: newUser[0]!.id,
        })
        .returning();
      orgId = newOrg[0]!.id;
    } else {
      const newOrg = await db
        .insert(orgs)
        .values({
          name: `${firstName} ${lastName}'s Organization`,
          slug: `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          ownerId: newUser[0]!.id,
        })
        .returning();
      orgId = newOrg[0]!.id;
    }

    await db
      .update(profiles)
      .set({ orgId })
      .where(eq(profiles.id, newUser[0]!.id));

    const accessToken = jwt.sign(
      {
        sub: newUser[0]!.id,
        org_id: orgId,
        email,
        role: 'owner',
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser[0]!.id,
          email: newUser[0]!.email,
          firstName: newUser[0]!.firstName,
          lastName: newUser[0]!.lastName,
          role: newUser[0]!.role,
          orgId,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    if (!user.length) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user[0]!.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const accessToken = jwt.sign(
      {
        sub: user[0]!.id,
        org_id: user[0]!.orgId,
        email: user[0]!.email,
        role: user[0]!.role,
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user[0]!.id,
          email: user[0]!.email,
          firstName: user[0]!.firstName,
          lastName: user[0]!.lastName,
          role: user[0]!.role,
          orgId: user[0]!.orgId,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

router.post('/refresh', (req, res) => {
  res.json({
    success: true,
    data: { accessToken: 'refresh-not-implemented' },
  });
});

export { router as authRoutes };
