const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const VendorPerformance = require('../models/VendorPerformance');
const ComplianceDocument = require('../models/ComplianceDocument');
const Alert = require('../models/Alert');
const AuditLog = require('../models/AuditLog');
const Report = require('../models/Report');

async function seedData() {
  try {
    // 1. Seed Users (Check if any exist first)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding users...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt); // default password for ease

      await User.create({
        name: 'John Admin',
        email: 'admin@vendorrisk.com',
        password: hashedPassword,
        role: 'Admin',
        department: 'Information Security'
      });

      await User.create({
        name: 'Sarah Procurement',
        email: 'procurement@vendorrisk.com',
        password: hashedPassword,
        role: 'Procurement Manager',
        department: 'Procurement'
      });

      await User.create({
        name: 'David Analyst',
        email: 'analyst@vendorrisk.com',
        password: hashedPassword,
        role: 'Risk Analyst',
        department: 'Risk & Compliance'
      });

      console.log('✅ Users seeded successfully (Default password: password123)');
    }

    // 2. Seed Vendors
    const vendorCount = await Vendor.countDocuments();
    let seededVendors = [];
    if (vendorCount === 0) {
      console.log('🌱 Seeding vendors...');
      const vendorsData = [
        {
          name: 'Apex Cloud Systems',
          category: 'Software',
          status: 'Active',
          contactPerson: 'Alice Johnson',
          email: 'alice@apexcloud.io',
          phone: '+1-555-0199',
          contractValue: 450000,
          contractStartDate: '2025-01-15',
          contractEndDate: '2026-07-15',
          riskScore: 24,
          riskLevel: 'Low'
        },
        {
          name: 'Global Logistics Corp',
          category: 'Logistics',
          status: 'Active',
          contactPerson: 'Bob Miller',
          email: 'b.miller@globallogistics.com',
          phone: '+1-555-0182',
          contractValue: 1200000,
          contractStartDate: '2024-06-01',
          contractEndDate: '2026-06-01',
          riskScore: 78,
          riskLevel: 'High'
        },
        {
          name: 'Quantum Tech Hardware',
          category: 'Hardware',
          status: 'Active',
          contactPerson: 'Carol Smith',
          email: 'csmith@quantumtech.com',
          phone: '+1-555-0176',
          contractValue: 850000,
          contractStartDate: '2025-03-01',
          contractEndDate: '2026-03-01',
          riskScore: 42,
          riskLevel: 'Medium'
        },
        {
          name: 'Summit Consulting Group',
          category: 'Consulting',
          status: 'Active',
          contactPerson: 'Daniel Davis',
          email: 'ddavis@summitconsulting.com',
          phone: '+1-555-0161',
          contractValue: 150000,
          contractStartDate: '2025-05-10',
          contractEndDate: '2026-05-10',
          riskScore: 15,
          riskLevel: 'Low'
        },
        {
          name: 'Titan Raw Materials',
          category: 'Raw Materials',
          status: 'Active',
          contactPerson: 'Emma Wilson',
          email: 'ewilson@titanmaterials.com',
          phone: '+1-555-0155',
          contractValue: 2300000,
          contractStartDate: '2023-11-15',
          contractEndDate: '2026-11-15',
          riskScore: 65,
          riskLevel: 'Medium'
        },
        {
          name: 'Vanguard Security Services',
          category: 'Services',
          status: 'Active',
          contactPerson: 'Frank Thomas',
          email: 'f.thomas@vanguardsec.com',
          phone: '+1-555-0144',
          contractValue: 620000,
          contractStartDate: '2024-09-01',
          contractEndDate: '2026-09-01',
          riskScore: 30,
          riskLevel: 'Low'
        },
        {
          name: 'Nebula Software Solutions',
          category: 'Software',
          status: 'Active',
          contactPerson: 'Grace Lee',
          email: 'glee@nebulasolutions.net',
          phone: '+1-555-0133',
          contractValue: 310000,
          contractStartDate: '2025-02-15',
          contractEndDate: '2026-02-15',
          riskScore: 82,
          riskLevel: 'High'
        },
        {
          name: 'Express Freight Link',
          category: 'Logistics',
          status: 'Active',
          contactPerson: 'Henry Wright',
          email: 'hwright@expressfreight.com',
          phone: '+1-555-0122',
          contractValue: 950000,
          contractStartDate: '2024-12-01',
          contractEndDate: '2026-06-30',
          riskScore: 50,
          riskLevel: 'Medium'
        },
        {
          name: 'Omni Consulting Partners',
          category: 'Consulting',
          status: 'Inactive',
          contactPerson: 'Irene Adler',
          email: 'iadler@omniconsulting.org',
          phone: '+1-555-0111',
          contractValue: 80000,
          contractStartDate: '2024-01-01',
          contractEndDate: '2025-01-01',
          riskScore: 12,
          riskLevel: 'Low'
        },
        {
          name: 'Horizon Steel & Alloys',
          category: 'Raw Materials',
          status: 'Active',
          contactPerson: 'Jack Peterson',
          email: 'jpeterson@horizonsteel.com',
          phone: '+1-555-0105',
          contractValue: 1450000,
          contractStartDate: '2024-03-15',
          contractEndDate: '2026-03-15',
          riskScore: 48,
          riskLevel: 'Medium'
        }
      ];

      for (const v of vendorsData) {
        const vendor = await Vendor.create(v);
        seededVendors.push(vendor);
      }
      console.log('✅ Vendors seeded successfully.');
    } else {
      seededVendors = await Vendor.find();
    }

    // 3. Seed Vendor Performance History
    const performanceCount = await VendorPerformance.countDocuments();
    if (performanceCount === 0 && seededVendors.length > 0) {
      console.log('🌱 Seeding vendor performance records...');
      // We will create historical performance entries for each vendor
      for (const vendor of seededVendors) {
        const isHighRisk = vendor.riskScore > 70;
        const isMedRisk = vendor.riskScore >= 40 && vendor.riskScore <= 70;
        
        // Generate historical monthly records (last 3 months)
        for (let i = 2; i >= 0; i--) {
          const evalDate = new Date();
          evalDate.setMonth(evalDate.getMonth() - i);
          
          let deliveryRate = isHighRisk ? 72 : isMedRisk ? 86 : 98;
          let quality = isHighRisk ? 75 : isMedRisk ? 88 : 96;
          let fulfillment = isHighRisk ? 80 : isMedRisk ? 90 : 99;
          let feedback = isHighRisk ? 70 : isMedRisk ? 85 : 95;

          // Add slight variation
          const variation = (i * 3) - 4;
          deliveryRate = Math.min(100, Math.max(0, deliveryRate + variation));
          quality = Math.min(100, Math.max(0, quality - variation));
          fulfillment = Math.min(100, Math.max(0, fulfillment + variation));
          feedback = Math.min(100, Math.max(0, feedback - variation));

          await VendorPerformance.create({
            vendorId: vendor._id.toString(),
            onTimeDeliveryRate: deliveryRate,
            qualityScore: quality,
            fulfillmentRate: fulfillment,
            feedbackScore: feedback,
            evaluationDate: evalDate.toISOString()
          });
        }
      }
      console.log('✅ Vendor Performance seeded successfully.');
    }

    // 4. Seed Compliance Documents
    const complianceCount = await ComplianceDocument.countDocuments();
    if (complianceCount === 0 && seededVendors.length > 0) {
      console.log('🌱 Seeding compliance documents...');
      const documentTypes = ['ISO Certificate', 'Business License', 'Audit Report', 'Insurance'];
      
      for (const vendor of seededVendors) {
        // High risk vendors have some expired/pending documents
        // Low risk vendors have all valid documents
        const isHighRisk = vendor.riskScore > 70;
        
        for (let idx = 0; idx < documentTypes.length; idx++) {
          const type = documentTypes[idx];
          let status = 'Valid';
          let expiryDate = new Date();
          
          if (isHighRisk && idx === 0) {
            status = 'Expired';
            expiryDate.setMonth(expiryDate.getMonth() - 2); // Expired 2 months ago
          } else if (isHighRisk && idx === 1) {
            status = 'Pending Renewal';
            expiryDate.setDate(expiryDate.getDate() + 10); // Expiry in 10 days
          } else {
            // General valid docs
            expiryDate.setMonth(expiryDate.getMonth() + 6 + idx * 3); // Expiry in future
          }

          await ComplianceDocument.create({
            vendorId: vendor._id.toString(),
            documentType: type,
            status: status,
            expiryDate: expiryDate.toISOString(),
            documentUrl: `/uploads/${vendor._id}_${type.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days ago
          });
        }
      }
      console.log('✅ Compliance Documents seeded successfully.');
    }

    // 5. Seed Alerts
    const alertCount = await Alert.countDocuments();
    if (alertCount === 0 && seededVendors.length > 0) {
      console.log('🌱 Seeding alerts...');
      
      // Look for a couple of vendors to alert on
      const highRiskVendors = seededVendors.filter(v => v.riskScore > 70);
      const medRiskVendors = seededVendors.filter(v => v.riskScore >= 40 && v.riskScore <= 70);

      if (highRiskVendors.length > 0) {
        await Alert.create({
          vendorId: highRiskVendors[0]._id.toString(),
          type: 'High Risk Score',
          severity: 'High',
          message: `Vendor '${highRiskVendors[0].name}' has exceeded the risk threshold with a score of ${highRiskVendors[0].riskScore}.`,
          isRead: false
        });

        // Let's create an expired document alert
        await Alert.create({
          vendorId: highRiskVendors[0]._id.toString(),
          type: 'Compliance Expiry',
          severity: 'High',
          message: `ISO Certificate for '${highRiskVendors[0].name}' has expired!`,
          isRead: false
        });
      }

      if (medRiskVendors.length > 0) {
        await Alert.create({
          vendorId: medRiskVendors[0]._id.toString(),
          type: 'Performance Drop',
          severity: 'Medium',
          message: `Vendor '${medRiskVendors[0].name}' has shown repeated delivery delays, dropping below 85% on-time delivery.`,
          isRead: false
        });
      }
      
      // Add a general alert about a contract ending
      await Alert.create({
        vendorId: seededVendors[2]._id.toString(),
        type: 'Contract Expiry',
        severity: 'Low',
        message: `Contract for '${seededVendors[2].name}' is set to expire on ${new Date(seededVendors[2].contractEndDate).toLocaleDateString()}.`,
        isRead: false
      });

      console.log('✅ Alerts seeded successfully.');
    }

    // 6. Seed Audit Logs
    const auditCount = await AuditLog.countDocuments();
    if (auditCount === 0) {
      console.log('🌱 Seeding audit logs...');
      
      await AuditLog.create({
        userId: 'system',
        userEmail: 'system@vrmp.local',
        action: 'System Initialization',
        details: 'Initial database configuration and mock seeding execution.',
        timestamp: new Date().toISOString()
      });

      await AuditLog.create({
        userId: 'admin_seeded',
        userEmail: 'admin@vendorrisk.com',
        action: 'User Login',
        details: 'Admin user logged in from dashboard console.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
      });

      console.log('✅ Audit logs seeded successfully.');
    }

    // 7. Seed Reports
    const reportCount = await Report.countDocuments();
    if (reportCount === 0) {
      console.log('🌱 Seeding reports...');
      
      await Report.create({
        title: 'Q1 Vendor Performance Audit',
        type: 'Performance',
        generatedBy: 'Sarah Procurement (procurement@vendorrisk.com)',
        format: 'PDF'
      });

      await Report.create({
        title: 'Enterprise Risk Distribution Analysis',
        type: 'Risk',
        generatedBy: 'David Analyst (analyst@vendorrisk.com)',
        format: 'Excel'
      });

      console.log('✅ Reports seeded successfully.');
    }

  } catch (error) {
    console.error('❌ Error during data seeding:', error);
  }
}

module.exports = seedData;
