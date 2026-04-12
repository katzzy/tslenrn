import { useState } from 'react';

export type MobilePane = 'problem' | 'editor' | 'result';

export function useWorkspaceUIState() {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>('problem');

  const openResetConfirm = () => {
    setIsResetConfirmOpen(true);
  };

  const cancelResetConfirm = () => {
    setIsResetConfirmOpen(false);
  };

  const confirmReset = (resetAction: () => void) => {
    resetAction();
    setIsResetConfirmOpen(false);
  };

  const toggleProblemCollapsed = () => {
    setIsProblemCollapsed((prev) => !prev);
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen((prev) => !prev);
  };

  const closeMoreMenu = () => {
    setIsMoreMenuOpen(false);
  };

  const resetForProblemSelect = () => {
    setIsResetConfirmOpen(false);
    setIsProblemCollapsed(false);
    setIsMoreMenuOpen(false);
    setMobilePane('problem');
  };

  const showResultPane = () => {
    setMobilePane('result');
  };

  return {
    isResetConfirmOpen,
    isProblemCollapsed,
    isMoreMenuOpen,
    mobilePane,
    setMobilePane,
    openResetConfirm,
    cancelResetConfirm,
    confirmReset,
    toggleProblemCollapsed,
    toggleMoreMenu,
    closeMoreMenu,
    resetForProblemSelect,
    showResultPane,
  };
}
