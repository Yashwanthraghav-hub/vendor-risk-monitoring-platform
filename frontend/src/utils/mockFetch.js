// Client-side localStorage database mock engine
const mockDataSeeded = () => {
  if (localStorage.getItem('vrmp_seeded')) return;

  console.log('🌱 Seeding client-side localStorage database...');
  
  // 1. Users
  const users = [
    { _id: 'u1', name: 'John Admin', email: 'admin@vendorrisk.com', role: 'Admin', department: 'Information Security' },
    { _id: 'u2', name: 'Sarah Procurement', email: 'procurement@vendorrisk.com', role: 'Procurement Manager', department: 'Procurement' },
    { _id: 'u3', name: 'David Analyst', email: 'analyst@vendorrisk.com', role: 'Risk Analyst', department: 'Risk & Compliance' }
  ];
  localStorage.setItem('vrmp_users', JSON.stringify(users));

  // 2. Vendors
  const vendors = [
    { _id: 'v1', name: 'Apex Cloud Systems', category: 'Software', status: 'Active', contactPerson: 'Alice Johnson', email: 'alice@apexcloud.io', phone: '+1-555-0199', contractValue: 450000, contractStartDate: '2025-01-15', contractEndDate: '2026-07-15', riskScore: 24, riskLevel: 'Low' },
    { _id: 'v2', name: 'Global Logistics Corp', category: 'Logistics', status: 'Active', contactPerson: 'Bob Miller', email: 'b.miller@globallogistics.com', phone: '+1-555-0182', contractValue: 1200000, contractStartDate: '2024-06-01', contractEndDate: '2026-06-01', riskScore: 78, riskLevel: 'High' },
    { _id: 'v3', name: 'Quantum Tech Hardware', category: 'Hardware', status: 'Active', contactPerson: 'Carol Smith', email: 'csmith@quantumtech.com', phone: '+1-555-0176', contractValue: 850000, contractStartDate: '2025-03-01', contractEndDate: '2026-03-01', riskScore: 42, riskLevel: 'Medium' },
    { _id: 'v4', name: 'Summit Consulting Group', category: 'Consulting', status: 'Active', contactPerson: 'Daniel Davis', email: 'ddavis@summitconsulting.com', phone: '+1-555-0161', contractValue: 150000, contractStartDate: '2025-05-10', contractEndDate: '2026-05-10', riskScore: 15, riskLevel: 'Low' },
    { _id: 'v5', name: 'Titan Raw Materials', category: 'Raw Materials', status: 'Active', contactPerson: 'Emma Wilson', email: 'ewilson@titanmaterials.com', phone: '+1-555-0155', contractValue: 2300000, contractStartDate: '2023-11-15', contractEndDate: '2026-11-15', riskScore: 65, riskLevel: 'Medium' },
    { _id: 'v6', name: 'Vanguard Security Services', category: 'Services', status: 'Active', contactPerson: 'Frank Thomas', email: 'f.thomas@vanguardsec.com', phone: '+1-555-0144', contractValue: 620000, contractStartDate: '2024-09-01', contractEndDate: '2026-09-01', riskScore: 30, riskLevel: 'Low' },
    { _id: 'v7', name: 'Nebula Software Solutions', category: 'Software', status: 'Active', contactPerson: 'Grace Lee', email: 'glee@nebulasolutions.net', phone: '+1-555-0133', contractValue: 310000, contractStartDate: '2025-02-15', contractEndDate: '2026-02-15', riskScore: 82, riskLevel: 'High' },
    { _id: 'v8', name: 'Express Freight Link', category: 'Logistics', status: 'Active', contactPerson: 'Henry Wright', email: 'hwright@expressfreight.com', phone: '+1-555-0122', contractValue: 950000, contractStartDate: '2024-12-01', contractEndDate: '2026-06-30', riskScore: 50, riskLevel: 'Medium' },
    { _id: 'v9', name: 'Omni Consulting Partners', category: 'Inactive', contactPerson: 'Irene Adler', email: 'iadler@omniconsulting.org', phone: '+1-555-0111', contractValue: 80000, contractStartDate: '2024-01-01', contractEndDate: '2025-01-01', riskScore: 12, riskLevel: 'Low' },
    { _id: 'v10', name: 'Horizon Steel & Alloys', category: 'Raw Materials', status: 'Active', contactPerson: 'Jack Peterson', email: 'jpeterson@horizonsteel.com', phone: '+1-555-0105', contractValue: 1450000, contractStartDate: '2024-03-15', contractEndDate: '2026-03-15', riskScore: 48, riskLevel: 'Medium' }
  ];
  localStorage.setItem('vrmp_vendors', JSON.stringify(vendors));

  // 3. Performance History
  const performances = [];
  vendors.forEach(v => {
    const isHigh = v.riskScore > 70;
    const isMed = v.riskScore >= 40 && v.riskScore <= 70;
    for (let i = 2; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      performances.push({
        _id: `p_${v._id}_${i}`,
        vendorId: v._id,
        onTimeDeliveryRate: isHigh ? 72 - i : isMed ? 86 - i : 98 - i,
        qualityScore: isHigh ? 75 + i : isMed ? 88 + i : 96 + i,
        fulfillmentRate: isHigh ? 80 - i : isMed ? 90 - i : 99 - i,
        feedbackScore: isHigh ? 70 + i : isMed ? 85 + i : 95 + i,
        evaluationDate: date.toISOString()
      });
    }
  });
  localStorage.setItem('vrmp_performances', JSON.stringify(performances));

  // 4. Compliance Documents
  const compliance = [];
  const docTypes = ['ISO Certificate', 'Business License', 'Audit Report', 'Insurance'];
  vendors.forEach(v => {
    const isHigh = v.riskScore > 70;
    docTypes.forEach((type, idx) => {
      let status = 'Valid';
      let date = new Date();
      if (isHigh && idx === 0) {
        status = 'Expired';
        date.setMonth(date.getMonth() - 2);
      } else if (isHigh && idx === 1) {
        status = 'Pending Renewal';
        date.setDate(date.getDate() + 10);
      } else {
        date.setMonth(date.getMonth() + 6 + idx * 3);
      }
      compliance.push({
        _id: `c_${v._id}_${idx}`,
        vendorId: v._id,
        documentType: type,
        status: status,
        expiryDate: date.toISOString(),
        documentUrl: `/uploads/${v._id}_doc.pdf`
      });
    });
  });
  localStorage.setItem('vrmp_compliance', JSON.stringify(compliance));

  // 5. Alerts
  const alerts = [
    { _id: 'a1', vendorId: 'v2', type: 'High Risk Score', severity: 'High', message: "Vendor 'Global Logistics Corp' has exceeded the risk threshold with a score of 78.", isRead: false, createdAt: new Date().toISOString() },
    { _id: 'a2', vendorId: 'v2', type: 'Compliance Expiry', severity: 'High', message: "ISO Certificate for 'Global Logistics Corp' has expired!", isRead: false, createdAt: new Date().toISOString() },
    { _id: 'a3', vendorId: 'v3', type: 'Performance Drop', severity: 'Medium', message: "Vendor 'Quantum Tech Hardware' has shown repeated delivery delays, dropping below 85% on-time delivery.", isRead: false, createdAt: new Date().toISOString() }
  ];
  localStorage.setItem('vrmp_alerts', JSON.stringify(alerts));

  // 6. Audit Logs
  const logs = [
    { _id: 'l1', userId: 'system', userEmail: 'system@vrmp.local', action: 'System Initialization', details: 'Initial local storage seeding execution.', timestamp: new Date().toISOString() }
  ];
  localStorage.setItem('vrmp_audit', JSON.stringify(logs));

  // 7. Reports
  const reports = [
    { _id: 'r1', title: 'Q1 Vendor Performance Audit', type: 'Performance', generatedBy: 'Sarah Procurement (procurement@vendorrisk.com)', format: 'PDF', createdAt: new Date().toISOString() }
  ];
  localStorage.setItem('vrmp_reports', JSON.stringify(reports));

  localStorage.setItem('vrmp_seeded', 'true');
  console.log('✅ Local storage seeded successfully!');
};

// Helper: Calculate dynamic risk score locally
const calculateLocalRisk = (vendorId) => {
  const performances = JSON.parse(localStorage.getItem('vrmp_performances') || '[]');
  const docs = JSON.parse(localStorage.getItem('vrmp_compliance') || '[]');
  const vendors = JSON.parse(localStorage.getItem('vrmp_vendors') || '[]');
  
  const vendor = vendors.find(v => v._id === vendorId);
  if (!vendor) return { score: 0, level: 'Low' };

  let score = 0;
  const history = performances.filter(p => p.vendorId === vendorId);
  let avgDelivery = 95;
  let avgQuality = 95;
  let avgFulfillment = 95;

  if (history.length > 0) {
    avgDelivery = history.reduce((sum, h) => sum + h.onTimeDeliveryRate, 0) / history.length;
    avgQuality = history.reduce((sum, h) => sum + h.qualityScore, 0) / history.length;
    avgFulfillment = history.reduce((sum, h) => sum + h.fulfillmentRate, 0) / history.length;
  }

  score += Math.min(25, (100 - avgDelivery) * 1.5);
  score += Math.min(25, (100 - avgQuality) * 1.5);

  const vendorDocs = docs.filter(d => d.vendorId === vendorId);
  let compliancePenalty = 0;
  vendorDocs.forEach(d => {
    if (d.status === 'Expired') compliancePenalty += 15;
    else if (d.status === 'Pending Renewal') compliancePenalty += 8;
  });
  score += Math.min(30, compliancePenalty);

  if (avgFulfillment < 85) score += 10;
  else if (avgFulfillment < 92) score += 5;

  if (vendor.category === 'Logistics') score += 8;
  else if (vendor.category === 'Raw Materials') score += 10;
  else if (vendor.category === 'Hardware') score += 5;
  else score += 2;

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  let level = 'Low';
  if (finalScore >= 70) level = 'High';
  else if (finalScore >= 40) level = 'Medium';

  return { score: finalScore, level };
};

// Override window.fetch globally to intercept API requests
const originalFetch = window.fetch;
window.fetch = async function (url, options) {
  const urlStr = url.toString();
  
  // If it's not an API call, let it pass normally
  if (!urlStr.includes('/api/')) {
    return originalFetch(url, options);
  }

  const isLocalHost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.endsWith('.local');

  if (isLocalHost) {
    try {
      const response = await originalFetch(url, options);
      if (response.status === 502 || response.status === 504 || response.status === 404) {
        throw new Error('Server offline or static route fallback');
      }
      return response;
    } catch (err) {
      console.warn(`⚠️ API redirect: Server offline or unreachable. Redirecting '${urlStr}' to local mock database.`);
    }
  }

  // Seed local storage databases if first run
  mockDataSeeded();

    const method = options?.method ? options.method.toUpperCase() : 'GET';
    const body = options?.body ? JSON.parse(options.body) : null;
    
    // Auth context headers
    const authHeader = options?.headers?.Authorization;
    let loggedUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      loggedUser = { id: 'u2', name: 'Sarah Procurement', email: 'procurement@vendorrisk.com', role: 'Procurement Manager' };
    }

    // Intercept Routes
    // 1. AUTH ROUTES
    if (urlStr.includes('/api/auth/login')) {
      const { email } = body;
      const users = JSON.parse(localStorage.getItem('vrmp_users') || '[]');
      const user = users.find(u => u.email === email) || users[1]; // default to Sarah if not matched
      
      return new Response(JSON.stringify({
        token: 'mock-jwt-token-12345',
        user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlStr.includes('/api/auth/register')) {
      const users = JSON.parse(localStorage.getItem('vrmp_users') || '[]');
      const newUser = { _id: `u_${Date.now()}`, ...body };
      users.push(newUser);
      localStorage.setItem('vrmp_users', JSON.stringify(users));

      return new Response(JSON.stringify({ message: 'Registered successfully', user: newUser }), { status: 201 });
    }

    if (urlStr.includes('/api/auth/profile')) {
      // Mock profile response
      const profile = { id: 'u2', name: 'Sarah Procurement', email: 'procurement@vendorrisk.com', role: 'Procurement Manager', department: 'Procurement' };
      return new Response(JSON.stringify(profile), { status: 200 });
    }

    if (urlStr.includes('/api/auth/forgot-password')) {
      return new Response(JSON.stringify({ message: 'Password recovery simulated.' }), { status: 200 });
    }

    // 2. COMPLIANCE ROUTES
    if (urlStr.includes('/api/compliance') && method === 'GET') {
      const docs = JSON.parse(localStorage.getItem('vrmp_compliance') || '[]');
      return new Response(JSON.stringify(docs), { status: 200 });
    }

    if (urlStr.includes('/api/compliance') && method === 'POST') {
      const docs = JSON.parse(localStorage.getItem('vrmp_compliance') || '[]');
      const newDoc = { _id: `c_${Date.now()}`, ...body, status: 'Valid', documentUrl: '/uploads/new_doc.pdf' };
      docs.push(newDoc);
      localStorage.setItem('vrmp_compliance', JSON.stringify(docs));

      return new Response(JSON.stringify(newDoc), { status: 201 });
    }

    if (urlStr.match(/\/api\/compliance\/.+\/reminder/) && method === 'POST') {
      return new Response(JSON.stringify({ message: 'Renewal reminder email simulated successfully.' }), { status: 200 });
    }

    // 3. ALERTS ROUTES
    if (urlStr.includes('/api/alerts') && method === 'GET') {
      const alerts = JSON.parse(localStorage.getItem('vrmp_alerts') || '[]');
      return new Response(JSON.stringify(alerts), { status: 200 });
    }

    if (urlStr.match(/\/api\/alerts\/.+\/read/) && method === 'PUT') {
      const alerts = JSON.parse(localStorage.getItem('vrmp_alerts') || '[]');
      const parts = urlStr.split('/');
      const alertId = parts[parts.length - 2];
      
      const idx = alerts.findIndex(a => a._id === alertId);
      if (idx !== -1) {
        alerts[idx].isRead = true;
        localStorage.setItem('vrmp_alerts', JSON.stringify(alerts));
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 4. AUDIT ROUTES
    if (urlStr.includes('/api/audit') && method === 'GET') {
      const audit = JSON.parse(localStorage.getItem('vrmp_audit') || '[]');
      return new Response(JSON.stringify(audit), { status: 200 });
    }

    // 5. REPORTS ROUTES
    if (urlStr.includes('/api/reports') && method === 'GET') {
      const reports = JSON.parse(localStorage.getItem('vrmp_reports') || '[]');
      return new Response(JSON.stringify(reports), { status: 200 });
    }

    if (urlStr.includes('/api/reports/generate') && method === 'POST') {
      const reports = JSON.parse(localStorage.getItem('vrmp_reports') || '[]');
      const newReport = { _id: `r_${Date.now()}`, ...body, generatedBy: 'Sarah Procurement', createdAt: new Date().toISOString() };
      reports.push(newReport);
      localStorage.setItem('vrmp_reports', JSON.stringify(reports));

      return new Response(JSON.stringify(newReport), { status: 201 });
    }

    // 6. VENDORS ROUTES
    // GET Predict
    if (urlStr.includes('/predict') && method === 'GET') {
      const parts = urlStr.split('/');
      const vendorId = parts[parts.length - 2];
      const vendors = JSON.parse(localStorage.getItem('vrmp_vendors') || '[]');
      const vendor = vendors.find(v => v._id === vendorId) || vendors[0];

      return new Response(JSON.stringify({
        vendorId: vendor._id,
        vendorName: vendor.name,
        predictions: {
          deliveryDelayProbability: vendor.riskLevel === 'High' ? 82 : vendor.riskLevel === 'Medium' ? 48 : 12,
          complianceFailureProbability: vendor.riskLevel === 'High' ? 76 : vendor.riskLevel === 'Medium' ? 35 : 8,
          performanceDeclineProbability: vendor.riskLevel === 'High' ? 68 : vendor.riskLevel === 'Medium' ? 30 : 15
        },
        insights: [
          `⚠️ Prediction score correlates to overall ${vendor.riskLevel} Risk level.`,
          `✅ Historical performance trend indicates normal operational thresholds.`
        ]
      }), { status: 200 });
    }

    // Vendor CRUD - GET ID
    if (urlStr.match(/\/api\/vendors\/.+/) && method === 'GET') {
      const parts = urlStr.split('/');
      const vendorId = parts[parts.length - 1].split('?')[0]; // strip query
      
      const vendors = JSON.parse(localStorage.getItem('vrmp_vendors') || '[]');
      const vendor = vendors.find(v => v._id === vendorId);
      
      if (!vendor) {
        return new Response(JSON.stringify({ message: 'Vendor not found' }), { status: 404 });
      }

      // Recalculate risk on demand
      const { score, level } = calculateLocalRisk(vendorId);
      vendor.riskScore = score;
      vendor.riskLevel = level;

      const performances = JSON.parse(localStorage.getItem('vrmp_performances') || '[]');
      const history = performances.filter(p => p.vendorId === vendorId);

      return new Response(JSON.stringify({ vendor, performance: history }), { status: 200 });
    }

    // Vendors CRUD - GET LIST
    if (urlStr.includes('/api/vendors') && method === 'GET') {
      const vendors = JSON.parse(localStorage.getItem('vrmp_vendors') || '[]');
      
      // Basic query filters simulation
      const urlObj = new URL(urlStr, window.location.origin);
      const search = urlObj.searchParams.get('search') || '';
      const category = urlObj.searchParams.get('category') || 'All';
      const riskLevel = urlObj.searchParams.get('riskLevel') || 'All';

      let filtered = vendors.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || v.category === category;
        const matchesRisk = riskLevel === 'All' || v.riskLevel === riskLevel;
        return matchesSearch && matchesCategory && matchesRisk;
      });

      return new Response(JSON.stringify({
        vendors: filtered,
        total: filtered.length,
        page: 1,
        totalPages: 1
      }), { status: 200 });
    }

    // Vendors CRUD - POST Create
    if (urlStr.includes('/api/vendors') && method === 'POST') {
      const vendors = JSON.parse(localStorage.getItem('vrmp_vendors') || '[]');
      const newVendor = {
        _id: `v_${Date.now()}`,
        ...body,
        riskScore: 15,
        riskLevel: 'Low'
      };
      vendors.push(newVendor);
      localStorage.setItem('vrmp_vendors', JSON.stringify(vendors));

      // Create dummy performance log
      const performances = JSON.parse(localStorage.getItem('vrmp_performances') || '[]');
      performances.push({
        _id: `p_${newVendor._id}`,
        vendorId: newVendor._id,
        onTimeDeliveryRate: 95,
        qualityScore: 92,
        fulfillmentRate: 98,
        feedbackScore: 90,
        evaluationDate: new Date().toISOString()
      });
      localStorage.setItem('vrmp_performances', JSON.stringify(performances));

      return new Response(JSON.stringify(newVendor), { status: 201 });
    }

    // Vendors CRUD - PUT Update
    if (urlStr.match(/\/api\/vendors\/.+/) && method === 'PUT') {
      const parts = urlStr.split('/');
      const vendorId = parts[parts.length - 1];
      const vendors = JSON.parse(localStorage.getItem('vrmp_vendors') || '[]');
      
      const idx = vendors.findIndex(v => v._id === vendorId);
      if (idx !== -1) {
        vendors[idx] = { ...vendors[idx], ...body };
        localStorage.setItem('vrmp_vendors', JSON.stringify(vendors));
        
        // recalculate risk
        const { score, level } = calculateLocalRisk(vendorId);
        vendors[idx].riskScore = score;
        vendors[idx].riskLevel = level;
        localStorage.setItem('vrmp_vendors', JSON.stringify(vendors));

        return new Response(JSON.stringify(vendors[idx]), { status: 200 });
      }
      return new Response(JSON.stringify({ message: 'Vendor not found' }), { status: 404 });
    }

    // Vendors CRUD - DELETE
    if (urlStr.match(/\/api\/vendors\/.+/) && method === 'DELETE') {
      const parts = urlStr.split('/');
      const vendorId = parts[parts.length - 1];
      const vendors = JSON.parse(localStorage.getItem('vrmp_vendors') || '[]');
      
      const filtered = vendors.filter(v => v._id !== vendorId);
      localStorage.setItem('vrmp_vendors', JSON.stringify(filtered));
      return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 });
    }

    // Return blank mock response for unmatched requests
    return new Response(JSON.stringify({}), { status: 200 });
};
