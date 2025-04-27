import React from 'react';


export const Button = ({ name, style, onclick }: { name: string, style: string ,onclick:()=>void}) => {
  return (
    <div className="flex w-max gap-4">
      <button className={style} type="button" onClick={onclick}>
        {name}
      </button>
    </div>
  );
};

export default Button;