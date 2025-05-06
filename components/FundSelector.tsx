import { useState, useEffect } from "react";
import Select from "react-select";
import { ChevronDown, Search } from "lucide-react";

interface MutualFundOption {
  value: string;
  label: string;
}

interface FundSelectorProps {
  funds: MutualFundOption[];
  selectedFund: MutualFundOption | null;
  onSelectFund: (fund: MutualFundOption | null) => void;
  isLoading: boolean;
}

const FundSelector = ({ funds, selectedFund, onSelectFund, isLoading }: FundSelectorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '0.75rem',
      borderColor: 'transparent',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'transparent',
      },
      padding: '0.5rem',
      transition: 'all 0.2s ease',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'hsl(215.4 16.3% 46.9%)',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      zIndex: 10,
    }),
  };

  return (
    <div className={`w-full max-w-xl transition-all duration-500 ${isMounted ? 'animate-slide-up' : 'opacity-0'}`}>
      <div className="mb-2 flex items-center">
        <span className="text-xs font-medium text-muted-foreground px-3 py-1 bg-primary/5 rounded-full">
          Select Fund
        </span>
      </div>
      <div className="relative">
        <Select
          options={funds}
          value={selectedFund}
          onChange={onSelectFund}
          className="custom-select"
          classNamePrefix="custom-select"
          placeholder={
            <div className="flex items-center gap-2">
              <Search size={16} />
              <span>Search for a mutual fund...</span>
            </div>
          }
          isLoading={isLoading}
          isSearchable
          styles={customStyles}
          components={{
            DropdownIndicator: () => (
              <div className="mr-2">
                <ChevronDown size={18} className="text-muted-foreground" />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default FundSelector;