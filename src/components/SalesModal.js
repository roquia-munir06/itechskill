import React, { useState } from 'react';
import './SalesModal.css';

const SalesModal = ({ plan, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    teamSize: '',
    startTimeline: '',
    budget: '',
    companySize: '',
    customContent: '',
    timeline: '',
    currentLMS: '',
    aiExperience: '',
    aiTopics: [],
    employeesToTrain: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          [name]: [...prev[name], value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Replace your generateEmailBody function with this cleaner version
const generateEmailBody = () => {
  let dynamicFieldsHtml = '';
  
  if (plan.name === 'Team Plan') {
    dynamicFieldsHtml = `
<h3>Team Details:</h3>
<ul>
<li><strong>Team Size:</strong> ${formData.teamSize}</li>
<li><strong>Start Timeline:</strong> ${formData.startTimeline}</li>
<li><strong>Monthly Budget:</strong> ${formData.budget}</li>
</ul>
    `.trim();
  } else if (plan.name === 'Enterprise Plan') {
    dynamicFieldsHtml = `
<h3>Enterprise Details:</h3>
<ul>
<li><strong>Company Size:</strong> ${formData.companySize}</li>
<li><strong>Custom Content:</strong> ${formData.customContent}</li>
<li><strong>Timeline:</strong> ${formData.timeline}</li>
<li><strong>Current LMS:</strong> ${formData.currentLMS || 'Not provided'}</li>
</ul>
    `.trim();
  } else if (plan.name === 'AI Fluency') {
    dynamicFieldsHtml = `
<h3>AI Training Details:</h3>
<ul>
<li><strong>AI Experience:</strong> ${formData.aiExperience}</li>
<li><strong>Topics:</strong> ${formData.aiTopics.join(', ')}</li>
<li><strong>Employees to Train:</strong> ${formData.employeesToTrain}</li>
</ul>
    `.trim();
  }

  return `
<h2>New ${plan.name} Lead</h2>
<h3>Personal Information:</h3>
<ul>
<li><strong>Name:</strong> ${formData.fullName}</li>
<li><strong>Email:</strong> ${formData.email}</li>
<li><strong>Phone:</strong> ${formData.phone}</li>
<li><strong>Company:</strong> ${formData.companyName || 'Not provided'}</li>
</ul>
${dynamicFieldsHtml}
<h3>Additional Message:</h3>
<p>${formData.message || 'No message provided'}</p>
<p style="font-size:12px;color:#666;">Submitted: ${new Date().toLocaleString()}</p>
  `.trim();
};

  const generateCustomerReplyBody = () => {
  return `
<h2 style="color:#5624d0;">Thank You for Your Interest!</h2>
<p>Dear ${formData.fullName},</p>
<p>Thank you for reaching out to us about the <strong>${plan.name}</strong>.</p>
<p>We have received your inquiry and our team will review it shortly.</p>
<h3>What's Next?</h3>
<ul>
<li>Our sales team will contact you within <strong>24 hours</strong></li>
<li>We'll schedule a call to discuss your requirements</li>
<li>We'll provide a customized solution for your team</li>
</ul>
<p>Best regards,<br><strong>iTechSkill Team</strong></p>
  `.trim();
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');

  // Build dynamic fields based on plan
  let dynamicFields = {};
  if (plan.name === 'Team Plan') {
    dynamicFields = {
      teamSize: formData.teamSize,
      startTimeline: formData.startTimeline,
      budget: formData.budget
    };
  } else if (plan.name === 'Enterprise Plan') {
    dynamicFields = {
      companySize: formData.companySize,
      customContent: formData.customContent,
      timeline: formData.timeline,
      currentLMS: formData.currentLMS
    };
  } else if (plan.name === 'AI Fluency') {
    dynamicFields = {
      aiExperience: formData.aiExperience,
      aiTopics: formData.aiTopics,
      employeesToTrain: formData.employeesToTrain
    };
  }

  try {
    const response = await fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType: plan.name,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName
        },
        dynamicFields,
        message: formData.message
      })
    });

    const result = await response.json();

    if (result.success) {
      onSubmit?.({ success: true, data: formData });
      onClose();
      alert(`Thank you ${formData.fullName}! We have received your inquiry. Our team will contact you within 24 hours.`);
    } else {
      setError(result.message || 'Failed to send inquiry. Please try again.');
}
  } catch (err) {
    console.error('Submit error:', err);
    setError('Network error. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const renderDynamicFields = () => {
    if (plan.name === 'Team Plan') {
      return (
        <div className="dynamic-fields-section">
          <h3>👥 Team Details</h3>
          <div className="form-group">
            <label>Team Size *</label>
            <select name="teamSize" value={formData.teamSize} onChange={handleChange} required>
              <option value="">Select team size</option>
              <option value="2-10">2-10 members</option>
              <option value="11-20">11-20 members</option>
              <option value="21-50">21–50 members</option>
<option value="50-100">50–100 members</option>
<option value="100-200">100–200 members</option>
              

            </select>
          </div>

          <div className="form-group">
            <label>When do you want to start? *</label>
            <select name="startTimeline" value={formData.startTimeline} onChange={handleChange} required>
              <option value="">Select timeline</option>
              <option value="immediately">Immediately</option>
              <option value="next-30-days">Next 30 days</option>
              <option value="next-60-days">Next 60 days</option>
              <option value="planning">Just planning</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Budget Range *</label>
            <select name="budget" value={formData.budget} onChange={handleChange} required>
              <option value="">Select budget range</option>
              <option value="under-500">Under $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-2500">$1,000 - $2,500</option>
              <option value="2500+">$2,500+</option>
            </select>
          </div>
        </div>
      );
    }

    if (plan.name === 'Enterprise Plan') {
      return (
        <div className="dynamic-fields-section">
          <h3>🏢 Enterprise Details</h3>
          <div className="form-group">
            <label>Company Size *</label>
            <select name="companySize" value={formData.companySize} onChange={handleChange} required>
              <option value="">Select company size</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1,000 employees</option>
              <option value="1000+">1,000+ employees</option>
            </select>
          </div>

          <div className="form-group">
            <label>Do you need custom content?</label>
            <select name="customContent" value={formData.customContent} onChange={handleChange}>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="maybe">Maybe</option>
            </select>
          </div>

          <div className="form-group">
            <label>When are you planning to roll this out? *</label>
<select name="timeline" value={formData.timeline} onChange={handleChange} required>
  <option value="">Select timeline</option>
  <option value="1-3-months">Within 1–3 months</option>
  <option value="3-6-months">Within 3–6 months</option>
  <option value="6-12-months">Within 6–12 months</option>
  <option value="next-year">Next year</option>
  <option value="exploring">Still evaluating / No timeline yet</option>
</select>
          </div>

          <div className="form-group">
            <label>Current Learning Platform (if any)</label>
            <input
              type="text"
              name="currentLMS"
              value={formData.currentLMS}
              onChange={handleChange}
              placeholder="e.g., Moodle, Canvas, etc."
            />
          </div>
        </div>
      );
    }

    if (plan.name === 'AI Fluency') {
      return (
        <div className="dynamic-fields-section">
          <h3>🤖 AI Training Details</h3>
          <div className="form-group">
            <label>Team's AI Experience Level *</label>
            <select name="aiExperience" value={formData.aiExperience} onChange={handleChange} required>
              <option value="">Select experience level</option>
              <option value="beginner">Beginner - No AI experience</option>
              <option value="intermediate">Intermediate - Some AI knowledge</option>
              <option value="advanced">Advanced - Active AI users</option>
            </select>
          </div>

          <div className="form-group">
            <label>Topics of Interest *</label>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="aiTopics" value="ChatGPT" onChange={handleChange} />
                ChatGPT & LLMs
              </label>
              <label>
                <input type="checkbox" name="aiTopics" value="Machine Learning" onChange={handleChange} />
                Machine Learning
              </label>
              <label>
                <input type="checkbox" name="aiTopics" value="AI Automation" onChange={handleChange} />
                AI Automation
              </label>
              <label>
                <input type="checkbox" name="aiTopics" value="Data Analytics" onChange={handleChange} />
                Data Analytics
              </label>
              <label>
                <input type="checkbox" name="aiTopics" value="Prompt Engineering" onChange={handleChange} />
                Prompt Engineering
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Number of employees to train *</label>
            <select name="employeesToTrain" value={formData.employeesToTrain} onChange={handleChange} required>
              <option value="">Select number</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-20">11-20 employees</option>
              <option value="21-50">21-50 employees</option>
              <option value="51-100">51-100 employees</option>
              <option value="100+">100+ employees</option>
            </select>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Request Information: {plan.name}</h2>
          <p>Fill out the form below and our team will get back to you within 24 hours</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Hassan Ali"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ali@company.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+92 3309998880"
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your Company"
              />
            </div>
          </div>

          {renderDynamicFields()}

          <div className="form-group">
            <label>Additional Message / Questions</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us more about your requirements..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalesModal;