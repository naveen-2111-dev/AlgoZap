'use client';

import { ReactFlowProvider } from 'reactflow';
import FlowEditor from '@/app/(components)/FlowEditor';
import { HomeIcon } from 'lucide-react'; // You can install lucide-react if needed
import Link from 'next/link';
import EditableTitle from '@/app/(components)/EditableTitle'; // Add this import


export default function CreatePage() {
  return (
    <div className="h-screen w-full bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0a0a] text-white">
        <Link href="/home" className="flex items-center gap-2 text-white hover:text-gray-300">
          <HomeIcon size={20} />
          <span className="text-sm">Home</span>
        </Link>

        {/* File Name Centered */}
      <EditableTitle />


        {/* Spacer for balance */}
        <div className="w-[70px]" />
      </div>

      {/* Flow Editor */}
      <div className="flex-1">
        <ReactFlowProvider>
          <FlowEditor />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
