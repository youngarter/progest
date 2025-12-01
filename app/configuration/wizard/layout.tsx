import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Children } from "react"

// Avant : export default function Page()
// Maintenant :
// app/configuration/wizard/layout.tsx

// 1. Assurez-vous d'utiliser la bonne signature de fonction (doit accepter { children })
export default function WizardLayout({
    children, // 👈 OBLIGATOIRE : La prop 'children'
}: {
    children: React.ReactNode; 
}) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      {/* Assurez-vous que tous ces composants sont importés ! */}
      <SidebarProvider className="flex flex-col"> 
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-12">
              {children} {/* 👈 Rendu des pages enfants */}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
// Note : Supprimez l'importation de 'Children' de 'react' si elle est présente.
// import { Children } from "react" ❌