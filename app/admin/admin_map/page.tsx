'use client';

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; 
import dynamic from "next/dynamic";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

const MapComponentGoogle = dynamic(() => import("@/components/MapComponentGoogle"), { ssr: false });

export default function StatisticsSection() {

return (
  <>
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/">
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" /> 
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Admin map
                </BreadcrumbLink>
              </BreadcrumbItem>                   
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <div className="aspect-video rounded-xl bg-muted/50">
          <MapComponentGoogle />
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  </>
);
}
