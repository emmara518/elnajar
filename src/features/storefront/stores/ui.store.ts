import { create } from 'zustand';

export interface UIState {
  isMegaMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  activeDropdown: string | null;
  activeModal: string | null;
  isScrolled: boolean;
  newsletterOpen: boolean;
}

export interface UIActions {
  toggleMegaMenu: () => void;
  closeMegaMenu: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setActiveDropdown: (id: string | null) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setScrolled: (scrolled: boolean) => void;
  setNewsletterOpen: (open: boolean) => void;
}

export type UIStore = UIState & UIActions;

export const initialUIState: UIState = {
  isMegaMenuOpen: false,
  isMobileMenuOpen: false,
  activeDropdown: null,
  activeModal: null,
  isScrolled: false,
  newsletterOpen: false,
};

export const useUIStore = create<UIStore>((set) => ({
  ...initialUIState,

  toggleMegaMenu: () => { set((s) => ({ isMegaMenuOpen: !s.isMegaMenuOpen })); },
  closeMegaMenu: () => { set({ isMegaMenuOpen: false }); },
  toggleMobileMenu: () => { set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })); },
  closeMobileMenu: () => { set({ isMobileMenuOpen: false }); },
  setActiveDropdown: (id) => { set({ activeDropdown: id }); },
  openModal: (id) => { set({ activeModal: id }); },
  closeModal: () => { set({ activeModal: null }); },
  setScrolled: (scrolled) => { set({ isScrolled: scrolled }); },
  setNewsletterOpen: (open) => { set({ newsletterOpen: open }); },
}));
