import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { marked } from "marked";

const getHTMLFromMarkdown = (markdown) => {
    if (!markdown) {
        return "<p>No content available</p>";
    }
    return marked(markdown);
};

const ResultPage = () => {
    const router = useRouter();
    const { response } = router.query;
    const responseAsString = Array.isArray(response) ? response[0] : response;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleHomeButtonClick = () => {
        router.push('/'); // Navigate to the home page
    };
    
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <div className="container">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <h2 className="toggle-button" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</h2>
                <ul>
                <li>
                    <button
                        className="sidebar-button"
                        onClick={handleHomeButtonClick}  // On click, navigate to home
                    >
                        Home
                    </button>
                </li>
                <li>
                    <button
                        className="sidebar-button"
                        // onClick={handleHomeButtonClick}  // On click, navigate to home
                        onClick={togglePopup}
                    >
                        Retry
                    </button>

                    {isPopupOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center'
                    }}>
                        <h2 className="text-gray-800">Grading...</h2>
                        <p className="text-gray-800">This may take some time,</p>
                        <p className="text-gray-800">so get some cookies!</p>
                        <p></p>
                    </div>
                </div>
            )}

                </li>
                </ul>
            </aside>

            {/* Main Chat-like Content */}
            <main className="chat-container">
                <h1 className="chat-title">Results</h1>
                <div
                    className="chat-message"
                    dangerouslySetInnerHTML={{ __html: getHTMLFromMarkdown(responseAsString) }}
                ></div>
            </main>

            {/* CSS Styles */}
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', sans-serif;
                }

                .container {
                    display: flex;
                    height: 100vh;
                    background: radial-gradient(circle, #ffffff, #fff1ff);
                    color: #333;
                    overflow: hidden;
                }

                /* Sidebar Styling */
                .sidebar {
                    width: 200px;
                    background: rgba(255, 255, 255, 0.4);
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    backdrop-filter: blur(10px);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    transition: width 0.3s ease-in-out;
                }

                .sidebar.closed {
                    width: 60px;
                    align-items: center;
                }

                .toggle-button {
                    font-size: 2rem;
                    margin-bottom: 20px;
                    color: #333;
                    cursor: pointer;
                    transition: transform 0.2s ease-in-out;
                    align-self: center;
                }

                .toggle-button:hover {
                    transform: scale(1.1);
                }

                .sidebar ul {
                    list-style: none;
                    padding: 0;
                    width: 100%;
                }

                .sidebar li {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    border-radius: 8px;
                    transition: background 0.3s, transform 0.2s ease-in-out;
                }

                .sidebar li:hover {
                    background: rgba(0, 0, 0, 0.05);
                    transform: scale(1.05);
                }

                .icon {
                    margin-right: 12px;
                    font-size: 1.5rem;
                }

                .label {
                    transition: opacity 0.3s ease-in-out;
                    white-space: nowrap;
                }

                .sidebar.closed .label {
                    display: none;
                }

                /* Sidebar Button - Styled like other Sidebar Items */
                .sidebar-button {
                    font-size: 1.2rem;
                    padding: 12px;
                    background: transparent;
                    color: #333;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    width: 100%;
                    border-radius: 8px;
                    transition: background 0.3s, transform 0.2s ease-in-out;
                }

                /* Hide the Sidebar Button when Sidebar is closed */
                .sidebar.closed .sidebar-button {
                    display: none;
                }

                /* Hover effect for Sidebar Button */
                .sidebar-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: scale(1.05);
                }

                /* Chat Container */
                .chat-container {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 20px;
                    padding-top: 10px;
                    text-align: center;
                    width: calc(100% - 60px);
                    transition: width 0.3s ease-in-out;
                    overflow-y: auto; 
                }

                .sidebar.open ~ .chat-container {
                    width: calc(100% - 200px);
                }

                .chat-title {
                    font-size: 2.5rem;
                    background: linear-gradient(to right, #fbbf24, #9b4dca);
                    -webkit-background-clip: text;
                    color: transparent;
                    margin-bottom: 15px;
                    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
                    transition: transform 0.2s ease-in-out;
                }

                .chat-title:hover {
                    transform: scale(1.05);
                }

                .chat-message {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.5in; /* Ensures text does not touch the edge */
                    border-radius: 12px;
                    width: 98%; /* Stretches box closer to the edges */
                    max-width: 98%;
                    font-size: 1.3rem;
                    text-align: left;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    white-space: normal;
                    overflow-wrap: break-word;
                    margin: 0 auto; /* Keeps it centered */
                }
            `}</style>
        </div>
    );
};

export default ResultPage;
