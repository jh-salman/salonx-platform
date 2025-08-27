"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users, Briefcase, Scissors, User } from "lucide-react";
import { Step1RegisterInput, Step2RegisterInput, Step3RegisterInput, Step4RegisterInput } from "@/lib/validations";

interface StepProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onPrev?: () => void;
  isLoading?: boolean;
}

export function Step1AccountCreation({ form, onNext }: StepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-gray-600 mt-2">Let's start with your basic information</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" {...register("firstName")} />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message as string}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" {...register("lastName")} />
            {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message as string}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message as string}</p>}
        </div>

        <Button onClick={onNext} className="w-full" size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}

export function Step2BusinessDetails({ form, onNext, onPrev }: StepProps) {
  const { register, formState: { errors }, setValue } = form;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <p className="text-gray-600 mt-2">Tell us about your salon</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salonName">Salon Name</Label>
          <Input id="salonName" placeholder="Your Salon Name" {...register("salonName")} />
          {errors.salonName && <p className="text-sm text-red-600">{errors.salonName.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="(555) 123-4567" {...register("phone")} />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" placeholder="123 Main St, City, State 12345" {...register("address")} />
          {errors.address && <p className="text-sm text-red-600">{errors.address.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select onValueChange={(value) => setValue("timezone", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
            </SelectContent>
          </Select>
          {errors.timezone && <p className="text-sm text-red-600">{errors.timezone.message as string}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Step3ServicesSetup({ form, onNext, onPrev }: StepProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const services = watch("services") || [{ name: "", duration: 60, price: 0 }];

  const addService = () => {
    setValue("services", [...services, { name: "", duration: 60, price: 0 }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setValue("services", services.filter((_: any, i: number) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Scissors className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
        <p className="text-gray-600 mt-2">Add the services you offer (you can add more later)</p>
      </div>

      <div className="space-y-4">
        {services.map((service: any, index: number) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Service {index + 1}</h4>
              {services.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`services.${index}.name`}>Service Name</Label>
              <Input
                placeholder="e.g., Haircut, Color, Manicure"
                {...register(`services.${index}.name`)}
              />
              {(errors.services as any)?.[index]?.name && (
                <p className="text-sm text-red-600">{(errors.services as any)?.[index]?.name?.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`services.${index}.duration`}>Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  {...register(`services.${index}.duration`, { valueAsNumber: true })}
                />
                {(errors.services as any)?.[index]?.duration && (
                  <p className="text-sm text-red-600">{(errors.services as any)?.[index]?.duration?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`services.${index}.price`}>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  {...register(`services.${index}.price`, { valueAsNumber: true })}
                />
                {(errors.services as any)?.[index]?.price && (
                  <p className="text-sm text-red-600">{(errors.services as any)?.[index]?.price?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addService}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Service
        </Button>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Step4TeamInvitation({ form, onNext, onPrev, isLoading }: StepProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const teamMembers = watch("teamMembers") || [];
  const skipTeamSetup = watch("skipTeamSetup") || false;

  const addTeamMember = () => {
    setValue("teamMembers", [...teamMembers, { name: "", email: "", role: "stylist" }]);
  };

  const removeTeamMember = (index: number) => {
    setValue("teamMembers", teamMembers.filter((_: any, i: number) => i !== index));
  };

  const handleSkipToggle = () => {
    setValue("skipTeamSetup", !skipTeamSetup);
    if (!skipTeamSetup) {
      setValue("teamMembers", []);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Invite Your Team</h2>
        <p className="text-gray-600 mt-2">Add team members to help manage your salon (optional)</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="skipTeamSetup"
            checked={skipTeamSetup}
            onChange={handleSkipToggle}
            className="rounded border-gray-300"
          />
          <Label htmlFor="skipTeamSetup" className="text-sm">
            Skip team setup for now (I'll add team members later)
          </Label>
        </div>

        {!skipTeamSetup && (
          <>
            {teamMembers.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No team members added yet</p>
                <Button onClick={addTeamMember} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            )}

            {teamMembers.map((member: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`teamMembers.${index}.name`}>Full Name</Label>
                    <Input
                      placeholder="Jane Smith"
                      {...register(`teamMembers.${index}.name`)}
                    />
                    {(errors.teamMembers as any)?.[index]?.name && (
                      <p className="text-sm text-red-600">{(errors.teamMembers as any)?.[index]?.name?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`teamMembers.${index}.email`}>Email</Label>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      {...register(`teamMembers.${index}.email`)}
                    />
                    {(errors.teamMembers as any)?.[index]?.email && (
                      <p className="text-sm text-red-600">{(errors.teamMembers as any)?.[index]?.email?.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`teamMembers.${index}.role`}>Role</Label>
                  <Select onValueChange={(value) => setValue(`teamMembers.${index}.role`, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stylist">Stylist</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  {(errors.teamMembers as any)?.[index]?.role && (
                    <p className="text-sm text-red-600">{(errors.teamMembers as any)?.[index]?.role?.message}</p>
                  )}
                </div>
              </div>
            ))}

            {teamMembers.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addTeamMember}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Team Member
              </Button>
            )}
          </>
        )}

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onPrev} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Complete Setup"}
          </Button>
        </div>
      </div>
    </div>
  );
}
