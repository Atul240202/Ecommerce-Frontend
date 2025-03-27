import { useEffect, useState } from 'react';
import { ShieldCheck, ShoppingBag, Lock, Plane } from 'lucide-react';

export function Features() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    { icon: Plane, title: 'Quality Assured', subtitle: 'Always' },
    { icon: ShoppingBag, title: '100% Original', subtitle: 'Products' },
    { icon: Lock, title: 'Secure', subtitle: 'Payments' },
    { icon: ShieldCheck, title: '100% Buyer', subtitle: 'Protection' },
  ];

  return (
    <div
      className={`flex justify-center  bg-white border-b ${
        isMobile ? 'gap-2 py-2' : 'gap-6 py-6'
      }`}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className='flex items-center gap-3 border px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-lg'
        >
          {isMobile ? (
            <></>
          ) : (
            <feature.icon
              className={`text-blue-600 ${isMobile ? 'w-3 h-3' : 'w-6 h-6'}`}
            />
          )}
          <div className={`${isMobile ? 'w-auto' : 'w-[10vw]'}`}>
            <h4
              className={`font-semibold text-gray-800 ${
                isMobile ? 'text-sm' : ''
              }`}
            >
              {feature.title}
            </h4>
            {isMobile ? (
              <></>
            ) : (
              <p className='text-sm text-gray-500'>{feature.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
