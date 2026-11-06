import { z } from "zod";
import { ToolType } from "@prisma/client";

export const LoveCalculatorSchema = z.object({
  name1: z.string().trim().min(1, "First person's name is required").max(60, "Name cannot exceed 60 characters"),
  name2: z.string().trim().min(1, "Second person's name is required").max(60, "Name cannot exceed 60 characters"),
});

export const FriendshipCalculatorSchema = z.object({
  name1: z.string().trim().min(1, "First friend's name is required").max(60, "Name cannot exceed 60 characters"),
  name2: z.string().trim().min(1, "Second friend's name is required").max(60, "Name cannot exceed 60 characters"),
});

export const FuturePartnerSchema = z.object({
  name: z.string().trim().min(1, "Your name is required").max(60, "Name cannot exceed 60 characters"),
  dob: z.string().trim().optional().or(z.literal("")),
});

export const MarriageCompatibilitySchema = z.object({
  name1: z.string().trim().min(1, "First person's name is required").max(60, "Name cannot exceed 60 characters"),
  name2: z.string().trim().min(1, "Second person's name is required").max(60, "Name cannot exceed 60 characters"),
  dob1: z.string().trim().optional().or(z.literal("")),
  dob2: z.string().trim().optional().or(z.literal("")),
});

export const LuckyNumberSchema = z.object({
  name: z.string().trim().min(1, "Your name is required").max(60, "Name cannot exceed 60 characters"),
  dob: z.string().trim().optional().or(z.literal("")),
});

export const BestFriendTestSchema = z.object({
  name1: z.string().trim().min(1, "First friend's name is required").max(60, "Name cannot exceed 60 characters"),
  name2: z.string().trim().min(1, "Second friend's name is required").max(60, "Name cannot exceed 60 characters"),
  answers1: z.record(z.string(), z.string()).refine((ans) => Object.keys(ans).length >= 1, "Friend 1 answers required"),
  answers2: z.record(z.string(), z.string()).refine((ans) => Object.keys(ans).length >= 1, "Friend 2 answers required"),
});

export const PersonalityTestSchema = z.object({
  answers: z.record(z.string(), z.string()).refine((ans) => Object.keys(ans).length >= 10, "Please answer all 10 questions"),
});

export const CreateSessionRequestSchema = z.object({
  toolType: z.nativeEnum(ToolType),
  payload: z.record(z.string(), z.any()),
});

export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
