import React, { useEffect, useState } from 'react';
import faqsService from '../services/faqs-service';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);

    const fetchFaqs = async () => {
        try {
            const fetchedFaqs = await faqsService.getAllFAQs();
            setFaqs(fetchedFaqs);
        } catch (error) {
            console.error('Failed to fetch FAQs:', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    return (
        <div className="d-flex justify-content-center" style={{ paddingTop: '20px' }}>
            <div className="faq-container text-center">
                {faqs.length > 0 ? (
                    faqs.map(faq => (
                        <div key={faq.faqId} className="faq-item mb-3">
                            <h3>{faq.question}</h3>
                            <p>{faq.answer}</p>
                        </div>
                    ))
                ) : (
                    <p>No FAQs available.</p>
                )}
            </div>
        </div>
    );
};

export default FAQ;
