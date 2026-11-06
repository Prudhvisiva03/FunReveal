import React from "react";
import Link from "next/link";
import { getSessionById } from "@/lib/session-service";
import { ResultClientView } from "./ResultClientView";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSessionById(id);

  if (!session) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-purple-950/40 border border-purple-700/40 backdrop-blur-xl">
          <AlertCircle className="w-14 h-14 text-pink-400 mx-auto mb-5" />
          <h2 className="text-white font-black text-2xl mb-3">Result Not Found</h2>
          <p className="text-purple-200/70 text-sm mb-6 leading-relaxed">
            This calculation session may have expired or is invalid. Please calculate again to unveil your cosmic result!
          </p>
          <Link href="/tools">
            <Button size="lg" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Tools
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <ResultClientView session={session} />;
}
