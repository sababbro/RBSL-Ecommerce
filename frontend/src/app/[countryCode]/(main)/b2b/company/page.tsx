import CompanyProfileForm from "@modules/b2b/components/company-profile-form"

export default function CompanyProfilePage() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-meximco-primary italic">Enterprise Compliance</h1>
        <p className="text-meximco-primary/60 mt-2">Registers your corporate identity with the Medusa B2B engine. Required for Tax-Inclusive wholesale quotations and bulk logistics.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <CompanyProfileForm />
        
        <div className="bg-meximco-primary text-white p-8 rounded-rounded border border-white/10 shadow-xl opacity-90">
          <h3 className="text-lg-semi mb-6 text-meximco-accent">Compliance Benefits</h3>
          <ul className="space-y-4 text-sm opacity-80">
            <li className="flex items-start">
              <span className="mr-3 text-lg">✓</span> 
              <div>
                <strong>VAT Exemption/Inclusion:</strong> Automatically calculate 15% VAT for compliant business transactions.
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-lg">✓</span> 
              <div>
                <strong>Net-30 Terms:</strong> Eligibility for commercial credit terms on orders over $5,000.
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-lg">✓</span> 
              <div>
                <strong>Priority Logistics:</strong> Specialized handling for biological specimens and bulk dry goods.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
