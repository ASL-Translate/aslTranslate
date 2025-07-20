import React, { useEffect } from 'react';
import AdminNavbar, { VerifyAdminSession } from '../components/admin_navbar.js';
import '../App.css';

export function AdminPanel() {
  useEffect(() => {
    async function Verify() {
      const authenticated = await VerifyAdminSession();
      if (authenticated === false) {
        window.location.href = "/admin"
      }
    }
    Verify();
  }, []); // run once on page-load

  return (
      <div className="App">
        <AdminNavbar />
        <header className="App-header">
          <div>
            <h1>Admin Panel</h1>
            Lorem ipsum dolor sit amet
          </div>
        </header>
      </div>
    );
}