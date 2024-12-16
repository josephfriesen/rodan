"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useFloating,
  useClick,
  useInteractions,
  useDismiss,
  useTransitionStyles,
  useFocus,
  useRole,
  FloatingPortal,
  Placement,
  autoUpdate,
  flip,
  offset,
  shift,
} from "@floating-ui/react";

type ClickablePopoverProps = {
  children: [React.ReactNode, React.ReactNode];
  placement?: string;
  setoff?: number;
  shiftPadding?: number;
  duration?: number;
  anchorClassName?: string;
  popoverClassName?: string;
};

export default function ClickablePopover({
  children,
  placement = "bottom",
  setoff = 5,
  shiftPadding = 5,
  duration = 200,
  anchorClassName = "",
  popoverClassName = "",
}: ClickablePopoverProps) {
  const [isOpen, setIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = React.useState(false);

  const {
    x,
    y,
    refs,
    floatingStyles,
    strategy,
    context,
    placement: computedPlacement,
  } = useFloating({
    placement: placement as Placement,
    open: isOpen,
    onOpenChange(open) {
      setIsOpen(open);
    },
    middleware: [offset(setoff), flip(), shift({ padding: shiftPadding })],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useFocus(context),
    useRole(context),
  ]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration,
  });

  const translate = {
    top: { translateY: setoff },
    bottom: { translateY: -setoff },
    left: { translateX: setoff },
    right: { translateX: -setoff },
  }[
    computedPlacement.includes("-")
      ? computedPlacement.split("-")[1]
      : computedPlacement
  ];

  return (
    <React.Fragment>
      <div
        className={anchorClassName}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {children[0]}
      </div>
      <FloatingPortal>
        <AnimatePresence>
          {isMounted && (
            <motion.div
              initial={{ opacity: 0, ...translate }}
              animate={{ opacity: 0.9, translateX: 0, translateY: 0 }}
              exit={{ opacity: 0, ...translate }}
              style={{ ...transitionStyles, ...floatingStyles }}
              {...getFloatingProps({
                ref: refs.setFloating,
                className: popoverClassName,
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                },
              })}
            >
              {children[1]}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </React.Fragment>
  );
}
