import * as React from 'react';

interface EmailTemplateProps {
  firstName?: string
  link: string
}

export default function EmailTemplate({ link }: EmailTemplateProps) {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: "#f4f6f8" }}>
      <table width="100%" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <td align="center" style={{ padding: "40px 0" }}>
              <table
                width="480"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  padding: "32px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  textAlign: "center",
                }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h2
                        style={{
                          margin: "0 0 12px 0",
                          color: "#111827",
                          fontSize: "22px",
                        }}
                      >
                        Verify your email
                      </h2>

                      <p
                        style={{
                          margin: "0 0 28px 0",
                          color: "#6b7280",
                          fontSize: "15px",
                          lineHeight: 1.5,
                        }}
                      >
                       
                        Please confirm your email address to activate your account.
                      </p>

                      <a
                        href={link}
                        style={{
                          display: "inline-block",
                          padding: "12px 24px",
                          backgroundColor: "#4f46e5",
                          color: "#ffffff",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Confirm Email
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}