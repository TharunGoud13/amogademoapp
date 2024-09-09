import { NextResponse } from "next/server";
import Imap from "imap";
import { simpleParser } from "mailparser";

export async function GET(req) {
  const imapConfigHeader = req.headers.get('X-IMAP-Config');
  const imapConfig = imapConfigHeader ? JSON.parse(imapConfigHeader) : null;

  if (!imapConfig) {
    return NextResponse.json({ error: "IMAP configuration not provided" }, { status: 400 });
  }


  try {
    const emails = await new Promise((resolve, reject) => {
      const imap = new Imap({
        user: imapConfig.user,
        password: imapConfig.password,
        host: imapConfig.host,
        port: imapConfig.port,
        tls: imapConfig.tls,
        tlsOptions: { rejectUnauthorized: false }, 
      });
      const emails = [];

      imap.once("ready", () => {
        imap.openBox("INBOX", false, (err) => {
          if (err) reject(err);

          const fetchOptions = {
            bodies: ["HEADER", "TEXT", ""],
            markSeen: false,
          };

          imap.search(["ALL"], (err, results) => {
            if (err) reject(err);

            if (results.length === 0) {
              imap.end();
              resolve([]);
              return;
            }

            let processedCount = 0;
            const fetcher = imap.fetch(results, fetchOptions);

            fetcher.on("message", (msg) => {
              let email = {
                uid: null,
                subject: "",
                from: "",
                text: "",
                date: "",
                isUnread: false,
                cc_emails:"",
                bcc_emails:""
              };

              msg.once("attributes", (attrs) => {
                email.isUnread = !attrs.flags.includes("\\Seen");
                email.uid = attrs.uid;
              });

              msg.on("body", (stream, info) => {
                if (info.which === "TEXT") {
                  stream.on("data", (chunk) => {
                    const formattedText = chunk.toString("utf8").match(/<div[^>]*>(.*?)<\/div>/);
                    console.log("formattedText",formattedText[1])
                    email.text += formattedText[1];
                  });
                }
                if (info.which === "HEADER") {
                  stream.on("data", (chunk) => {
                    email.header += chunk.toString("utf8");
                  });
                }
                if (info.which === "") {
                  let buffer = "";
                  stream.on("data", (chunk) => {
                    buffer += chunk.toString("utf8");
                  });
                  stream.once("end", () => {
                    simpleParser(buffer, (err, parsed) => {
                      if (err) {
                        return;
                      }
                      console.log("parsed----",parsed)
                      const fromEmail = parsed.from?.text.split("<")[1];
                      const formattedText = parsed.text.match(/<div[^>]*>(.*?)<\/div>/);
                      email.subject = parsed.subject || "No Subject";
                      email.cc_emails = parsed?.cc?.text || "";
                      email.bcc_emails = parsed?.bcc?.text || "";
                      email.from = fromEmail.substring(0, fromEmail.length - 1) || "Unknown Sender";
                      if (!email.text) email.text = formattedText || "No Content";
                      email.date = parsed.date?.toISOString() || new Date().toISOString();
                      
                      emails.push(email);
                      processedCount++;
                      if (processedCount === results.length) {
                        imap.end();
                        resolve(emails);
                      }
                    });
                  });
                }
              });
            });

            fetcher.once("error", (err) => {
              reject(err);
            });

            fetcher.once("end", () => {
              // Fetch completed
            });
          });
        });
      });

      imap.once("error", (err) => {
        reject(err);
      });

      imap.once("end", () => {
        // IMAP connection ended
      });

      imap.connect();
    });
    // Sort emails by date, most recent first
    emails.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Caught error:', error);
    return NextResponse.json(
      { error: "Error fetching emails" },
      { status: 500 }
    );
  }
}