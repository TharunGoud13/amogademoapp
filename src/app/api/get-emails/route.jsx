    import { NextResponse } from 'next/server';
    import Imap from 'imap';
    import { simpleParser } from 'mailparser';

    export async function GET() {
    const imapConfig = {
        user: 'tarun@morr.biz',
        password: 'tarun@8888',
        host: 'sc132.mschosting.cloud',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }, // Remove this in production
    };

    try {
        const emails = await new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);
        const emails = [];

        imap.once('ready', () => {
            imap.openBox('INBOX', false, (err) => {
            if (err) reject(err);

            const fetchOptions = {
                bodies: ['HEADER', 'TEXT', ''],
                markSeen: false,
            };

            imap.search(['ALL'], (err, results) => {
                if (err) reject(err);

                if (results.length === 0) {
                imap.end();
                resolve([]);
                return;
                }

                let processedCount = 0;
                const fetcher = imap.fetch(results, fetchOptions);

                fetcher.on('message', (msg) => {
                let email = {
                    uid:null,
                    subject: '',
                    from: '',
                    text: '',
                    date: '',
                    isUnread: false
                };

                msg.once('attributes', (attrs) => {
                    email.isUnread = !attrs.flags.includes('\\Seen');
                    email.uid = attrs.uid;
                });

                msg.on('body', (stream, info) => {
                    if (info.which === 'TEXT') {
                    stream.on('data', (chunk) => {
                        email.text += chunk.toString('utf8');
                    });
                    }
                    if (info.which === 'HEADER') {
                    stream.on('data', (chunk) => {
                        email.header += chunk.toString('utf8');
                    });
                    }
                    if (info.which === '') {
                    let buffer = '';
                    stream.on('data', (chunk) => {
                        buffer += chunk.toString('utf8');
                    });
                    stream.once('end', () => {
                        simpleParser(buffer, (err, parsed) => {
                        if (err) {
                            console.error('Parsing error:', err);
                            return;
                        }
                        email.subject = parsed.subject || 'No Subject';
                        email.from = parsed.from?.text || 'Unknown Sender';
                        if (!email.text) email.text = parsed.text || 'No Content';
                        email.date = parsed.date?.toISOString() || new Date().toISOString();
                        
                        console.log('Parsed email:', email);  // Debug log
                        
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

                fetcher.once('error', (err) => {
                console.error('Fetch error:', err);
                reject(err);
                });

                fetcher.once('end', () => {
                console.log('Fetch completed');
                });
            });
            });
        });

        imap.once('error', (err) => {
            console.error('IMAP error:', err);
            reject(err);
        });

        imap.once('end', () => {
            console.log('IMAP connection ended');
        });

        imap.connect();
        });

        // Sort emails by date, most recent first
        emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        console.log(`Fetched ${emails.length} emails`);
        return NextResponse.json(emails);
    } catch (error) {
        console.error('Caught error:', error);
        return NextResponse.json({ error: 'Error fetching emails' }, { status: 500 });
    }
    }