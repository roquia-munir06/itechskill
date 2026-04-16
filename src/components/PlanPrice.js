
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import SalesModal from './SalesModal';
import './PlanPrice.css';

const PlanPrice = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const deploymentPlans = [
    {
      id: 1,
      name: "Team Plan",
      targetAudience: "2 to 50 people - For your team",
      pricing: "$25.00 per month each user annually billed.",
      billingNote: "Billed annually. Cancel anytime.",
      features: [
        "Access to 13,000+ top courses",
        "Certification prep",
        "Goals-focused recommendations",
        "AI-powered coaching",
        "Analytics and adoption reports"
      ],
      buttonText: "Team Plan",
      color: "#5624d0"
    },
    {
      id: 2,
      name: "Enterprise Plan",
      targetAudience: "More than 20 people - For your whole organization",
      pricing: "Contact sales for prices.",
      billingNote: null,
      features: [
        "Access to 30,000+ top courses",
        "Certification prep",
        "Goals-focused recommendations",
        "AI-powered coaching",
        "Advanced analytics and insights",
        "Dedicated customer success team",
        "Customizable content",
        "Add-ons include hands-on technical training"
      ],
      buttonText: "Enterprise Plan",
      color: "#5624d0"
    },
    {
      id: 3,
      name: "AI Fluency",
      targetAudience: "From AI growth to company-wide transformation",
      pricing: null,
      billingNote: null,
      sections: [
        {
          title: "AI Readiness",
          audience: "More than 100 audiences",
          description: "Over 50 curated courses + AI Assistant to start, other content imported from external platforms"
        },
        {
          title: "AI Growth",
          audience: "More than 20 people",
          description: "AI and technical skills with 800+ specialized courses and 30+ job-based learning paths in various languages."
        }
      ],
      buttonText: "AI Fluency",
      color: "#5624d0"
    }
  ];

  return (
    <>
      <div className="deployment-strategies-section">
        <div className="deployment-container">
          <div className="deployment-header">
            <h2 className="deployment-main-title">
              Grow your team's skills and your business
            </h2>
            <p className="deployment-subtitle">
              Reach goals faster with one of our plans or programs. Try one free today or contact sales to learn more.
            </p>
          </div>

          <div className="deployment-plans-grid">
            {deploymentPlans.map((plan) => (
              <div key={plan.id} className="deployment-plan-card">
                <div className="plan-header">
                  <div className="plan-icon-container" style={{ backgroundColor: plan.color }}>
                  </div>
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-audience">{plan.targetAudience}</p>
                </div>

                <div className="plan-buttons-container">
                  <button 
                    className="plan-cta-button"
                    onClick={() => handlePlanClick(plan)}
                  >
                    {plan.buttonText}
                  </button>
                  
                  <button 
                    className="plan-contact-button"
                    onClick={handleContactClick}
                  >
                    Contact Us
                  </button>
                </div>
                
                <div className="plan-body">
                  {plan.pricing && (
                    <div className="plan-pricing">
                      <p className="pricing-amount">{plan.pricing}</p>
                      {plan.billingNote && (
                        <p className="billing-note">{plan.billingNote}</p>
                      )}
                    </div>
                  )}

                  {plan.features && (
                    <ul className="plan-features-list">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="plan-feature-item">
                          <FaCheck className="plan-feature-check-icon" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {plan.sections && (
                    <div className="plan-sections">
                      {plan.sections.map((section, index) => (
                        <div key={index} className="plan-section">
                          <h4 className="plan-section-title">
                            {section.title}
                          </h4>
                          <p className="plan-section-audience">
                            {section.audience}
                          </p>
                          <p className="section-description">{section.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedPlan && (
        <SalesModal
          plan={selectedPlan}
          onClose={handleModalClose}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
          }}
        />
      )}
    </>
  );
};

export default PlanPrice;