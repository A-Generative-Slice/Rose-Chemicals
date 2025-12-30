const Inquiry = require('../models/Inquiry');

// Submit an inquiry (quote or contact)
exports.submitInquiry = async (req, res) => {
    try {
        const inquiryData = req.body;

        // Validate required fields based on type
        if (!inquiryData.type || !['quote', 'contact'].includes(inquiryData.type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid inquiry type'
            });
        }

        const inquiry = await Inquiry.create(inquiryData);

        // Optional: Send notification email to admin
        // const emailService = require('../services/emailService');
        // await emailService.sendAdminNotification(inquiry);

        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully',
            inquiry
        });
    } catch (error) {
        console.error('Inquiry Submission Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get all inquiries (admin only)
exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort('-createdAt');
        res.json({
            success: true,
            inquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Update inquiry status (admin only)
exports.updateInquiryStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        if (status) inquiry.status = status;
        if (adminNotes) inquiry.adminNotes = adminNotes;

        await inquiry.save();

        res.json({
            success: true,
            message: 'Inquiry updated successfully',
            inquiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
