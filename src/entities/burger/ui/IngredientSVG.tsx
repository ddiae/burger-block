import type { IngredientType } from '../../../shared/types';

interface IngredientSVGProps {
  type: IngredientType;
  width?: number;
  height?: number;
  className?: string;
}

function BottomBun() {
  return (
    <svg viewBox="0 0 300 70" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="150" cy="55" rx="145" ry="20" fill="#c8873a" />
      <rect x="5" y="35" width="290" height="30" fill="#d4924a" rx="4" />
      <ellipse cx="150" cy="35" rx="145" ry="10" fill="#e8a862" />
    </svg>
  );
}

function TopBun() {
  return (
    <svg viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="150" cy="75" rx="145" ry="15" fill="#c8873a" />
      <path d="M5,72 Q5,10 150,10 Q295,10 295,72 Z" fill="#e8a862" />
      <path d="M5,72 Q5,55 150,55 Q295,55 295,72 Z" fill="#d4924a" />
      {/* sesame seeds */}
      <ellipse cx="110" cy="35" rx="8" ry="5" fill="#f5d0a0" transform="rotate(-20,110,35)" />
      <ellipse cx="150" cy="22" rx="8" ry="5" fill="#f5d0a0" transform="rotate(5,150,22)" />
      <ellipse cx="190" cy="35" rx="8" ry="5" fill="#f5d0a0" transform="rotate(20,190,35)" />
      <ellipse cx="130" cy="50" rx="7" ry="4" fill="#f5d0a0" transform="rotate(-10,130,50)" />
      <ellipse cx="170" cy="48" rx="7" ry="4" fill="#f5d0a0" transform="rotate(15,170,48)" />
    </svg>
  );
}

function Patty() {
  return (
    <svg viewBox="0 0 300 55" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20,30 Q15,12 50,8 Q100,2 150,4 Q200,2 250,8 Q285,12 280,30 Q285,48 250,50 Q200,54 150,52 Q100,54 50,50 Q15,48 20,30 Z"
        fill="#5c3317"
      />
      <path
        d="M30,28 Q25,15 60,12 Q105,7 150,9 Q195,7 240,12 Q270,15 270,28"
        fill="none"
        stroke="#7a4a28"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* grill marks */}
      <path d="M80,15 Q90,28 80,42" fill="none" stroke="#3d2008" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M120,12 Q130,27 120,43" fill="none" stroke="#3d2008" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M160,12 Q170,27 160,43" fill="none" stroke="#3d2008" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M200,14 Q210,28 200,42" fill="none" stroke="#3d2008" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function Cheese() {
  return (
    <svg viewBox="0 0 300 40" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5,5 L295,5 L295,32 Q270,42 250,30 Q230,42 210,30 Q190,42 170,30 Q150,42 130,30 Q110,42 90,30 Q70,42 50,30 Q30,42 5,30 Z"
        fill="#f5c842"
      />
      <rect x="5" y="5" width="290" height="20" fill="#f7d060" rx="2" />
    </svg>
  );
}

function Lettuce() {
  return (
    <svg viewBox="0 0 300 45" xmlns="http://www.w3.org/2000/svg">
      {/* wavy green layers */}
      <path
        d="M5,30 Q25,5 50,22 Q75,5 100,22 Q125,5 150,22 Q175,5 200,22 Q225,5 250,22 Q275,5 295,22 L295,40 Q270,28 250,38 Q225,25 200,38 Q175,25 150,38 Q125,25 100,38 Q75,25 50,38 Q25,28 5,40 Z"
        fill="#4caf50"
      />
      <path
        d="M5,22 Q25,5 50,18 Q75,5 100,18 Q125,5 150,18 Q175,5 200,18 Q225,5 250,18 Q275,5 295,18"
        fill="none"
        stroke="#388e3c"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}

function Tomato() {
  return (
    <svg viewBox="0 0 300 40" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="20" rx="70" ry="16" fill="#e53935" />
      <ellipse cx="220" cy="20" rx="70" ry="16" fill="#e53935" />
      <ellipse cx="150" cy="20" rx="70" ry="16" fill="#ef5350" />
      {/* seed dots */}
      <ellipse cx="65" cy="18" rx="5" ry="3" fill="#ffcdd2" opacity="0.7" />
      <ellipse cx="95" cy="23" rx="5" ry="3" fill="#ffcdd2" opacity="0.7" />
      <ellipse cx="135" cy="16" rx="5" ry="3" fill="#ffcdd2" opacity="0.7" />
      <ellipse cx="165" cy="24" rx="5" ry="3" fill="#ffcdd2" opacity="0.7" />
      <ellipse cx="205" cy="17" rx="5" ry="3" fill="#ffcdd2" opacity="0.7" />
      <ellipse cx="235" cy="23" rx="5" ry="3" fill="#ffcdd2" opacity="0.7" />
      {/* dividing lines */}
      <line x1="75" y1="5" x2="75" y2="35" stroke="#c62828" strokeWidth="1" opacity="0.5" />
      <line x1="225" y1="5" x2="225" y2="35" stroke="#c62828" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function Onion() {
  return (
    <svg viewBox="0 0 300 40" xmlns="http://www.w3.org/2000/svg">
      {/* onion rings */}
      <ellipse cx="150" cy="20" rx="140" ry="16" fill="none" stroke="#9c7bb5" strokeWidth="10" opacity="0.5" />
      <ellipse cx="150" cy="20" rx="110" ry="12" fill="none" stroke="#ce93d8" strokeWidth="8" opacity="0.5" />
      <ellipse cx="150" cy="20" rx="80" ry="9" fill="none" stroke="#9c7bb5" strokeWidth="7" opacity="0.5" />
      <ellipse cx="150" cy="20" rx="50" ry="6" fill="none" stroke="#ce93d8" strokeWidth="6" opacity="0.5" />
    </svg>
  );
}

function BulgogiSauce() {
  return (
    <svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10,15 Q40,5 80,18 Q120,5 160,18 Q200,5 240,18 Q270,8 290,15 L295,25 Q265,20 240,26 Q200,18 160,26 Q120,18 80,26 Q40,20 10,25 Z"
        fill="#7b3f00"
        opacity="0.85"
      />
      <path
        d="M10,15 Q40,5 80,18 Q120,5 160,18 Q200,5 240,18 Q270,8 290,15"
        fill="none"
        stroke="#a0522d"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}

function CheeseSauce() {
  return (
    <svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10,15 Q40,5 80,18 Q120,5 160,18 Q200,5 240,18 Q270,8 290,15 L295,25 Q265,20 240,26 Q200,18 160,26 Q120,18 80,26 Q40,20 10,25 Z"
        fill="#f5c842"
        opacity="0.9"
      />
      <path
        d="M10,15 Q40,5 80,18 Q120,5 160,18 Q200,5 240,18 Q270,8 290,15"
        fill="none"
        stroke="#f9a825"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}

function SpecialSauce() {
  return (
    <svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10,15 Q40,5 80,18 Q120,5 160,18 Q200,5 240,18 Q270,8 290,15 L295,25 Q265,20 240,26 Q200,18 160,26 Q120,18 80,26 Q40,20 10,25 Z"
        fill="#e64a19"
        opacity="0.85"
      />
      <path
        d="M10,15 Q40,5 80,18 Q120,5 160,18 Q200,5 240,18 Q270,8 290,15"
        fill="none"
        stroke="#ff7043"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}

function Bacon() {
  return (
    <svg viewBox="0 0 300 40" xmlns="http://www.w3.org/2000/svg">
      {/* wavy bacon strips */}
      <path
        d="M5,20 Q30,8 60,20 Q90,32 120,20 Q150,8 180,20 Q210,32 240,20 Q270,8 295,20"
        fill="none"
        stroke="#c62828"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M5,20 Q30,8 60,20 Q90,32 120,20 Q150,8 180,20 Q210,32 240,20 Q270,8 295,20"
        fill="none"
        stroke="#e57373"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M5,30 Q30,18 60,30 Q90,42 120,30 Q150,18 180,30 Q210,42 240,30 Q270,18 295,30"
        fill="none"
        stroke="#8d2c2c"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M5,30 Q30,18 60,30 Q90,42 120,30 Q150,18 180,30 Q210,42 240,30 Q270,18 295,30"
        fill="none"
        stroke="#e57373"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

function Egg() {
  return (
    <svg viewBox="0 0 300 55" xmlns="http://www.w3.org/2000/svg">
      {/* egg white */}
      <ellipse cx="150" cy="30" rx="140" ry="22" fill="#fffde7" />
      <ellipse cx="90" cy="32" rx="60" ry="16" fill="#fff9c4" opacity="0.7" />
      <ellipse cx="210" cy="32" rx="55" ry="14" fill="#fff9c4" opacity="0.7" />
      {/* yolk */}
      <circle cx="150" cy="28" r="18" fill="#ffb300" />
      <circle cx="150" cy="28" r="14" fill="#ffc107" />
      <circle cx="144" cy="23" r="5" fill="#ffe082" opacity="0.6" />
    </svg>
  );
}

const SVG_MAP: Record<IngredientType, React.ComponentType> = {
  bottom_bun: BottomBun,
  top_bun: TopBun,
  patty: Patty,
  cheese: Cheese,
  lettuce: Lettuce,
  tomato: Tomato,
  onion: Onion,
  bulgogi_sauce: BulgogiSauce,
  cheese_sauce: CheeseSauce,
  special_sauce: SpecialSauce,
  bacon: Bacon,
  egg: Egg,
};

export default function IngredientSVG({ type, width = 300, height, className = '' }: IngredientSVGProps) {
  const Component = SVG_MAP[type];
  if (!Component) return null;

  return (
    <div
      className={className}
      style={{ width, height: height ?? 'auto', display: 'flex', alignItems: 'center' }}
    >
      <Component />
    </div>
  );
}
