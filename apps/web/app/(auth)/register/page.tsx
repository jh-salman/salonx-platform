"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { Step1AccountCreation, Step2BusinessDetails, Step3ServicesSetup, Step4TeamInvitation } from "@/components/auth/register-steps";
import { step1RegisterSchema, step2RegisterSchema, step3RegisterSchema, step4RegisterSchema, Step1RegisterInput, Step2RegisterInput, Step3RegisterInput, Step4RegisterInput } from "@/lib/validations";
import { toast } from "react-hot-toast";
import { createSalonXClient } from "@repo/sdk";

const STEPS = [
  { title: "Account", description: "Basic information" },
  { title: "Business", description: "Salon details" },
  { title: "Services", description: "Your offerings" },
  { title: "Team", description: "Invite staff" },
];

const salonxClient = createSalonXClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
});

type CompleteFormData = Step1RegisterInput & Step2RegisterInput & Step3RegisterInput & Step4RegisterInput;

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CompleteFormData>>({});
  const router = useRouter();

  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1: return step1RegisterSchema;
      case 2: return step2RegisterSchema;
      case 3: return step3RegisterSchema;
      case 4: return step4RegisterSchema;
      default: return step1RegisterSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: formData,
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const stepData = form.getValues();
    setFormData(prev => ({ ...prev, ...stepData }));

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      form.reset({ ...formData, ...stepData });
    } else {
      await handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const completeData = { ...formData, ...form.getValues() } as CompleteFormData;
      
      const registrationData = {
        email: completeData.email,
        password: completeData.password,
        firstName: completeData.firstName,
        lastName: completeData.lastName,
        orgName: completeData.salonName,
      };

      const response = await salonxClient.register(registrationData);
      
      if (response.success) {
        toast.success("Registration successful! Welcome to SalonX!");
        router.push("/dashboard");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      form,
      onNext: handleNext,
      onPrev: currentStep > 1 ? handlePrev : undefined,
      isLoading,
    };

    switch (currentStep) {
      case 1: return <Step1AccountCreation {...stepProps} />;
      case 2: return <Step2BusinessDetails {...stepProps} />;
      case 3: return <Step3ServicesSetup {...stepProps} />;
      case 4: return <Step4TeamInvitation {...stepProps} />;
      default: return <Step1AccountCreation {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-6">
          <ProgressSteps steps={STEPS} currentStep={currentStep} />
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
}
