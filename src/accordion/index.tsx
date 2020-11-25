import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

const AccordionContext = createContext<undefined | IAccordionContext>(
  undefined
);

interface IAccordion {
  multiple?: boolean;
  collapsible?: boolean;
  defaultIndex?: number[];
  children: React.ReactNode;
  onChange?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
/**
 * WAI-ARIA: https://www.w3.org/TR/2019/WD-wai-aria-practices-1.2-20191218/#accordion
 */
export const Accordion: React.FC<IAccordion> = ({
  multiple = false,
  collapsible = false,
  defaultIndex = [],
  onChange,
  children
}) => {
  const [selected, setSelected] = useState(defaultIndex);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // if the accordion does not allow for multi select but the dev passed more than 1 default index
    if (!multiple && selected.length > 1) {
      // set selected to the first item they provided
      setSelected([selected[0]]);
    }
  }, [multiple, selected]);

  useEffect(() => {
    // If the accordion is not collapsible but the dev did not pass a default index
    if (selected.length === 0 && !collapsible) {
      // set the selected element to the first item
      setSelected([0]);
    }
  }, [selected, collapsible]);

  function handleSetIndex(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) {
    e.preventDefault();
    onChange?.(e);
    const numberOfActivePanels = selected.length;
    if (selected.includes(index)) {
      // dont collapse last open item if the accordion isn't collapsible
      if (numberOfActivePanels === 1 && !collapsible) {
        return;
      }
      return setSelected(selected.filter((item) => item !== index));
    } else {
      // dont allow multiple panels to open if the accordion doesnt support multiple open
      if (!multiple) {
        return setSelected([index]);
      }
      return setSelected([...selected, index]);
    }
  }

  const context = {
    selected,
    handleSetIndex,
    multiple,
    collapsible,
    panelRef
  };

  return (
    <div className="accordion" ref={panelRef}>
      <AccordionContext.Provider value={context}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (context === undefined) {
    throw new Error(
      "Accordion Context must be used inside of an Accordion element"
    );
  }
  return context;
};

const AccordionItemContext = createContext<undefined | IAccordionItemContext>(
  undefined
);

interface IAccordionItem {
  children: React.ReactNode;
}
export const AccordionItem: React.FC<IAccordionItem> = ({ children }) => {
  const { panelRef, selected } = useAccordionContext();
  const [expanded, toggleItem] = useState(false);
  const [elementIndex, setElementIndex] = useState(0);
  const itemRef = useRef(null);

  useEffect(() => {
    if (panelRef?.current && itemRef?.current) {
      const panelRefChildren = panelRef?.current?.childNodes;
      panelRefChildren?.forEach((el, index) => {
        if (el === itemRef.current) {
          setElementIndex(index);
          if (selected.includes(index)) {
            toggleItem(true);
          } else {
            toggleItem(false);
          }
        }
      });
    }
  }, [panelRef, itemRef, selected, expanded]);

  const context = {
    expanded,
    elementIndex
  };

  return (
    <div className="accordion-item" ref={itemRef}>
      <AccordionItemContext.Provider value={context}>
        {children}
      </AccordionItemContext.Provider>
    </div>
  );
};

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (context === undefined) {
    throw new Error(
      "Accordion Item Context must be used inside of an AccordionItem"
    );
  }
  return context;
};

interface IAccordionHeader {
  children: React.ReactNode;
}

export const AccordionHeader: React.FC<IAccordionHeader> = ({ children }) => {
  const { handleSetIndex } = useAccordionContext();
  const { elementIndex, expanded } = useAccordionItemContext();
  return (
    <div className="accordion-header" role="heading" aria-level={2}>
      <button type="button" onClick={(e) => handleSetIndex(e, elementIndex)}>
        <>
          {children}

          <span className="accordion-header__icon" aria-hidden>
            {expanded ? "-" : "+"}
          </span>
        </>
      </button>
    </div>
  );
};

interface IAccordionPanel {
  children: React.ReactNode;
}
export const AccordionPanel: React.FC<IAccordionPanel> = ({ children }) => {
  const { expanded } = useAccordionItemContext();

  return (
    <div className="accordion-panel">
      {expanded ? <div className="accordion-content">{children}</div> : null}
    </div>
  );
};

// TYPES
interface IAccordionContext {
  selected: number[];
  handleSetIndex: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
  multiple: boolean;
  collapsible: boolean;
  panelRef: React.MutableRefObject<HTMLDivElement | null>;
}

interface IAccordionItemContext {
  expanded: boolean;
  elementIndex: number;
}
