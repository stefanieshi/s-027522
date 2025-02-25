
import { Image } from "lucide-react";

const TrustedBy = () => {
  const companies = [
    { 
      name: "Stripe", 
      className: "w-24", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
    },
    { 
      name: "HubSpot", 
      className: "w-28", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png" 
    },
    { 
      name: "Intercom", 
      className: "w-28", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Intercom_logo.png" 
    },
    { 
      name: "Asana", 
      className: "w-24", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Asana_logo.svg/1280px-Asana_logo.svg.png" 
    },
    { 
      name: "Atlassian", 
      className: "w-28", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Atlassian-logo.svg/1200px-Atlassian-logo.svg.png" 
    },
    { 
      name: "Slack", 
      className: "w-24", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/2560px-Slack_Technologies_Logo.svg.png" 
    }
  ];

  return (
    <section className="py-24 bg-neutral-200/50">
      <div className="container-padding">
        <p className="text-center text-neutral-600 mb-12 font-medium">Trusted by popular startups you know</p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
          {companies.map((company) => (
            <div key={company.name} className="flex flex-col items-center">
              <div className={`${company.className} h-12 flex items-center justify-center`}>
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className="h-full object-contain" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
