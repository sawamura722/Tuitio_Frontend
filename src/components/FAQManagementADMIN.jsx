import React, { useEffect, useState } from 'react';
import faqsService from '../services/faqs-service';
import AdminSidebar from './AdminSidebar';

const FAQManagementADMIN = () => {
    const [faqs, setFaqs] = useState([]);
    const [selectedFAQ, setSelectedFAQ] = useState(null);
    const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFAQs = async () => {
        try {
            const fetchedFAQs = await faqsService.getAllFAQs();
            setFaqs(fetchedFAQs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const handleCreateFAQ = async () => {
        try {
            await faqsService.createFAQ(newFAQ);
            fetchFAQs();
            setNewFAQ({ question: '', answer: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateFAQ = async () => {
        if (selectedFAQ) {
            const updatedFAQ = {
                ...newFAQ,
                faqId: selectedFAQ.faqId, 
            };
    
            try {
                await faqsService.updateFAQ(selectedFAQ.faqId, updatedFAQ);
                fetchFAQs();
                setSelectedFAQ(null);
                setNewFAQ({ faqId: null, question: '', answer: '' }); // Reset to initial state
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleDeleteFAQ = async (faqId) => {
        try {
            await faqsService.deleteFAQ(faqId);
            fetchFAQs();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSelectFAQ = (faq) => {
        setSelectedFAQ(faq);
        setNewFAQ({ question: faq.question, answer: faq.answer });
    };

    const handleCancelUpdate = () => {
        setSelectedFAQ(null);
        setNewFAQ({ question: '', answer: '' });
    };

    if (loading) return <div>Loading FAQs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Flex container */}
            <AdminSidebar/>
                <div className="container mt-4">
                    <h2>FAQ Management</h2>
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Question"
                            value={newFAQ.question}
                            onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                            className="form-control mb-2"
                        />
                        <textarea
                            placeholder="Answer"
                            value={newFAQ.answer}
                            onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                            className="form-control mb-2"
                        />
                        <button
                            className="btn btn-primary"
                            onClick={selectedFAQ ? handleUpdateFAQ : handleCreateFAQ}
                        >
                            {selectedFAQ ? 'Update FAQ' : 'Create FAQ'}
                        </button>
                        {selectedFAQ && (
                            <button
                                className="btn btn-secondary ml-2"
                                onClick={handleCancelUpdate}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((faq) => (
                                <tr key={faq.faqId}>
                                    <td>{faq.question}</td>
                                    <td>{faq.answer}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleSelectFAQ(faq)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm ml-2"
                                            onClick={() => handleDeleteFAQ(faq.faqId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default FAQManagementADMIN;
