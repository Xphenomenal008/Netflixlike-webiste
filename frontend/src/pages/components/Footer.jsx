import React from 'react';

const Footer = () => {
    return (
        <footer className="footer bg-gray-800 text-white border-t border-gray-800 py-6 md:px-8 md:py-0  relative bottom-0">
            <div className='flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row'>
                <p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
                    built by{" "}
                    <a className='font-medium underline underline-offset-4' href="https://github.com/Xphenomenal008">
                        Ashutosh Katoch
                    </a>
                    . The source code is available on{' '}
                <a className='font-medium underline underline-offset-4' href="https://github.com/Xphenomenal008/Netflixlike-webiste">
                  GitHub
                </a>
                </p>
                

            </div>

 
        </footer>
    );
};

export default Footer;