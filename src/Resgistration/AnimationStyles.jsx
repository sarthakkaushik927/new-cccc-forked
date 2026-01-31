export const flickerStyles = `
  @keyframes flicker-border-card {
    /* --- STATE 1: STEADY ON (Visible 92% of the time) --- */
    0%, 92% { 
      border-color: rgba(0, 170, 255, 0.8); 
      box-shadow: 0 0 25px rgba(0, 170, 255, 0.45); /* Strong Steady Glow */
    }

    /* --- STATE 2: GLITCH / DIM SEQUENCE (Brief failures) --- */
    
    /* Fail 1 (Dim) */
    92.5% { 
      border-color: rgba(0, 170, 255, 0.1); 
      box-shadow: none; 
    }
    
    /* Spike Back On */
    93% { 
      border-color: rgba(0, 170, 255, 0.8); 
      box-shadow: 0 0 25px rgba(0, 170, 255, 0.45); 
    }
    
    /* Fail 2 (Dim) */
    93.5% { 
      border-color: rgba(0, 170, 255, 0.1); 
      box-shadow: none; 
    }
    
    /* Spike Back On */
    94% { 
      border-color: rgba(0, 170, 255, 0.8); 
      box-shadow: 0 0 25px rgba(0, 170, 255, 0.45); 
    }

    /* Fail 3 (Longer Dim) */
    95% { 
      border-color: rgba(0, 170, 255, 0.1); 
      box-shadow: none; 
    }
    
    /* --- RETURN TO STEADY ON --- */
    100% { 
      border-color: rgba(0, 170, 255, 0.8); 
      box-shadow: 0 0 25px rgba(0, 170, 255, 0.45); 
    }
  }

  .animate-flicker-card {
    animation: flicker-border-card 5s infinite linear;
  }
`;