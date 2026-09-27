import React, { useState, useEffect } from 'react';
import './index.css';
import { Scan, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Papa from 'papaparse';
import logoPng from './assets/logo.png';
import rawCsv from '../links.csv?raw';

function App() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (rawCsv) {
      Papa.parse(rawCsv, {
        complete: (results) => {
          // Extract links (column 0) and names (column 1) from the CSV
          const parsedLinks = results.data
            .filter(row => row && row.length > 0 && row[0].trim() !== '')
            .map((row, index) => ({ 
              id: index + 1, 
              url: row[0].trim(),
              name: row.length > 1 ? row[1].trim() : `QR #${index + 1}`
            }));
          setLinks(parsedLinks);
        },
        header: false
      });
    }
  }, [rawCsv]);

  return (
    <div className="app-container">
      {/* Background elements */}
      <div className="grid-bg"></div>
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-text">
            <h2>TPC-PCE</h2>
            <p>TRAIN POTENTIAL • PROMOTE SKILLS</p>
          </div>
          <div className="logo-icon">
            <div className="diamond"></div>
            <div className="diamond"></div>
            <div className="diamond"></div>
          </div>
        </div>
        <div className="role-tag">
          <span className="dot"></span>
          QR GENERATOR MODE
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="scanners-grid">
          {links.length === 0 ? (
            <div style={{ color: 'white', textAlign: 'center', width: '100%', padding: '20px' }}>
              No links found in links.csv
            </div>
          ) : (
            links.map((linkData) => (
              <div key={linkData.id} className="scanner-card">
                <div className="scanner-header">
                  <ShieldCheck size={18} className="shield-icon" />
                  <span className="active-pass-text">LINK QR CODE</span>
                </div>
                
                <div className="qr-container" style={{ padding: '20px', background: 'white', borderRadius: '10px', margin: '20px 0', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <QRCodeSVG 
                    value={linkData.url} 
                    size={200}
                    fgColor="lightgreen"
                    bgColor="white"
                    level="H"
                    imageSettings={{
                      src: logoPng,
                      x: undefined,
                      y: undefined,
                      height: 50,
                      width: 50,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="scanner-info">
                  <h3 className="person-name" style={{ color: '#9d9797ff', marginTop: '10px' }}>{linkData.name}</h3>
                  <div className="person-role" style={{ wordBreak: 'break-all', fontSize: '0.8rem', opacity: 0.8, color: '#666' }}>
                    QR #{linkData.id}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-pattern"></div>
        <div className="footer-content">
          <div className="footer-title">
            <ShieldCheck size={18} className="shield-icon" />
            MES COLLEGE COMMITTEE
            <span className="year-tag">TPC-PCE 2025-26</span>
          </div>
          <p className="footer-credits">
            © 2026 - 2027 Training & Placement Committee • Official Digital Credential
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
