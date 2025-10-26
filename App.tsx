
import React, { useState, useCallback, useEffect } from 'react';
import PasswordDisplay from './components/PasswordDisplay';
import Checkbox from './components/Checkbox';
import Slider from './components/Slider';

const CHARSETS = {
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export default function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const options = {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    };

    let allowedChars = '';
    const guaranteedChars = [];

    if (options.includeLowercase) {
      allowedChars += CHARSETS.LOWERCASE;
      guaranteedChars.push(CHARSETS.LOWERCASE[Math.floor(Math.random() * CHARSETS.LOWERCASE.length)]);
    }
    if (options.includeUppercase) {
      allowedChars += CHARSETS.UPPERCASE;
      guaranteedChars.push(CHARSETS.UPPERCASE[Math.floor(Math.random() * CHARSETS.UPPERCASE.length)]);
    }
    if (options.includeNumbers) {
      allowedChars += CHARSETS.NUMBERS;
      guaranteedChars.push(CHARSETS.NUMBERS[Math.floor(Math.random() * CHARSETS.NUMBERS.length)]);
    }
    if (options.includeSymbols) {
      allowedChars += CHARSETS.SYMBOLS;
      guaranteedChars.push(CHARSETS.SYMBOLS[Math.floor(Math.random() * CHARSETS.SYMBOLS.length)]);
    }

    if (allowedChars.length === 0) {
      setPassword('');
      return;
    }
    
    const remainingLength = options.length - guaranteedChars.length;
    let randomChars = '';
    for (let i = 0; i < remainingLength; i++) {
      randomChars += allowedChars[Math.floor(Math.random() * allowedChars.length)];
    }

    const passwordArray = (randomChars + guaranteedChars.join('')).split('');
    
    // Fisher-Yates shuffle
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    
    setPassword(passwordArray.join(''));
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isGenerateDisabled = !includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1920/1080?animal" 
          alt="Animal background" 
          className="object-cover w-full h-full" 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      <main className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight sm:text-5xl">FaunaPass Generator</h1>
          <p className="mt-4 text-lg text-gray-300">Create strong, secure passwords with a touch of the wild.</p>
        </div>

        <div className="bg-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20">
            <PasswordDisplay password={password} onCopy={handleCopyToClipboard} copied={copied} />

            <div className="space-y-6 mt-8">
              <Slider 
                label="Password Length"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
                min={8}
                max={32}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Checkbox 
                    id="uppercase"
                    label="Include Uppercase"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                  <Checkbox 
                    id="lowercase"
                    label="Include Lowercase"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                  />
                  <Checkbox 
                    id="numbers"
                    label="Include Numbers"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  <Checkbox 
                    id="symbols"
                    label="Include Symbols"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
              </div>

              <button
                onClick={generatePassword}
                disabled={isGenerateDisabled}
                className="w-full bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Generate Password
              </button>
            </div>
        </div>
      </main>
    </div>
  );
}
