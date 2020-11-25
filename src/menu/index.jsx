import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  createContext,
  useContext
} from "react";

const defaultState = {
  isOpen: false,
  isMenuFocused: false,
  isContainerFocused: false,
  activeIndex: 1
};

function menuReducer(state, action) {
  switch (action.type) {
    case "close_menu": {
      return { ...state, isOpen: false, activeIndex: -1 };
    }
    case "open_menu": {
      return { ...state, isOpen: true, activeIndex: action.index };
    }
    case "set_active_index": {
      return { ...state, activeIndex: action.index };
    }
    case "set_container_focused": {
      return { ...state, isContainerFocused: action.value };
    }
    case "set_menu_focused": {
      return { ...state, isMenuFocused: action.value };
    }
    default: {
      return state;
    }
  }
}

const MenuContext = createContext(defaultState);

function useMenuContext() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenuContext must be used in a MenuContext provider");
  }
  return context;
}

const Menu = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, defaultState);
  const menuContainer = useRef(null);
  const menuButton = useRef(null);

  function focusMenu() {
    return menuButton?.current.focus();
  }

  const closeMenu = useCallback(() => {
    dispatch({ type: "close_menu" });
    focusMenu();
  }, []);

  function openMenu() {
    const nodes = menuContainer?.current.childNodes;
    const childrenAsArray = Array.from(nodes);
    const nonDisabledIndex = childrenAsArray.findIndex(
      (el) => !el.getAttribute("aria-disabled") === true
    );
    dispatch({ type: "open_menu", index: nonDisabledIndex });
  }

  function setIndex(index) {
    return dispatch({ type: "set_active_index", index });
  }

  function setContainerFocused(value) {
    return dispatch({ type: "set_container_focused", value });
  }

  function setMenuFocused(value) {
    return { type: "set_menu_focused", value };
  }

  useEffect(() => {
    if (state.isOpen) {
      const nodes = menuContainer?.current.childNodes;
      if (nodes && state.activeIndex >= 0 && state.activeIndex < nodes.length) {
        nodes[state.activeIndex].focus();
      }
    }
  }, [state.isOpen, state.activeIndex]);

  useEffect(() => {
    // handle clicking outside of the menu
    const outsideClickListener = (e) => {
      const target = e.target;
      const nodes = menuContainer?.current.childNodes;
      const childrenAsArray = nodes && Array.from(nodes);
      if (childrenAsArray?.length > 0 && !childrenAsArray.includes(target)) {
        closeMenu();
      }
    };
    if (state.isOpen) {
      document.addEventListener("click", outsideClickListener);
      return () => document.removeEventListener("click", outsideClickListener);
    }
  }, [state.isOpen, closeMenu]);

  const context = {
    state,
    // Dispatch
    focusMenu,
    closeMenu,
    openMenu,
    setIndex,
    setContainerFocused,
    setMenuFocused,
    // Refs
    menuContainer,
    menuButton
  };

  return (
    <MenuContext.Provider value={context}>
      <div className="menu">{children}</div>
    </MenuContext.Provider>
  );
};

const MenuButton = ({
  onClick,
  onKeyDown,
  onFocus,
  onBlur,
  as: Comp,
  ...rest
}) => {
  const {
    menuButton,
    state: { isOpen },
    closeMenu,
    openMenu,
    setContainerFocused
  } = useMenuContext();

  function handleMenuButtonClick(event) {
    event.preventDefault();
    return isOpen ? closeMenu() : openMenu();
  }

  // key actions for menu button
  function handleButtonKeyEvents(event) {
    switch (event.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        openMenu();
        break;
      }
      default: {
        break;
      }
    }
  }
  return (
    <Comp
      ref={menuButton}
      {...rest}
      role="button"
      aria-haspopup
      aria-expanded={isOpen ? true : undefined}
      onClick={handleMenuButtonClick}
      onKeyDown={handleButtonKeyEvents}
      onFocus={() => setContainerFocused(true)}
      onBlur={() => setContainerFocused(false)}
    />
  );
};

const MenuList = ({ children }) => {
  const {
    menuContainer,
    state: { activeIndex, isOpen },
    setIndex,
    closeMenu
  } = useMenuContext();

  const nodes = menuContainer?.current?.childNodes;
  const nodesAsArray = nodes && Array.from(nodes);

  const focusNextItem = () => {
    const nextNonDisabledIndex = nodesAsArray.findIndex(
      (el, index) =>
        index > activeIndex && !el.getAttribute("aria-disabled") === true
    );
    return nextNonDisabledIndex === -1 ? null : setIndex(nextNonDisabledIndex);
  };

  const focusPrevItem = () => {
    const enabledIndexes = [];
    nodesAsArray.forEach((el, index) => {
      if (!el.getAttribute("aria-disabled") === true && index < activeIndex) {
        enabledIndexes.push(index);
      }
    });

    return enabledIndexes.length === 0
      ? null
      : setIndex(enabledIndexes[enabledIndexes.length - 1]);
  };

  function handleMenuKeyEvents(event) {
    event.preventDefault();
    switch (event.key) {
      case " ":
      case "ArrowDown": {
        focusNextItem();
        break;
      }
      case "ArrowUp": {
        focusPrevItem();
        break;
      }
      case "Escape": {
        closeMenu();
        break;
      }
      default: {
        break;
      }
    }
  }

  return (
    <div
      ref={menuContainer}
      role="menu"
      className="menu-list"
      data-visible={isOpen || undefined}
      onKeyDown={handleMenuKeyEvents}
    >
      {children}
    </div>
  );
};

const MenuListItem = ({ onKeyDown, onClick, disabled, ...rest }) => {
  const { closeMenu, setContainerFocused } = useMenuContext();

  function handleOptionClick(e) {
    e.preventDefault();
    if (disabled) {
      return;
    }
    if (onClick) {
      onClick(e);
    }
    closeMenu();
  }

  function handleMenuItemsKeyEvents(event) {
    if (onKeyDown) {
      onKeyDown(event);
    }
    switch (event.key) {
      case " ":
      case "Enter": {
        event.stopPropagation();
        handleOptionClick(event);
        return;
      }
      default: {
        break;
      }
    }
  }

  return (
    <div
      {...rest}
      className="menu-item"
      role="menuitem"
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      onClick={handleOptionClick}
      onKeyDown={handleMenuItemsKeyEvents}
      onFocus={() => setContainerFocused(true)}
      onBlur={() => setContainerFocused(false)}
    />
  );
};

export { Menu, MenuButton, MenuList, MenuListItem };
