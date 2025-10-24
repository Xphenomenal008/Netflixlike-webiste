import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Add to global scope for Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
