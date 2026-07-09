import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const firebaseMocks = vi.hoisted(() => ({
  authStateCallback: null,
  auth: {},
  db: {},
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('@/js/firebase', () => ({
  auth: firebaseMocks.auth,
  db: firebaseMocks.db,
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: firebaseMocks.createUserWithEmailAndPassword,
  signOut: firebaseMocks.signOut,
  signInWithEmailAndPassword: firebaseMocks.signInWithEmailAndPassword,
  onAuthStateChanged: firebaseMocks.onAuthStateChanged,
}));

vi.mock('firebase/firestore', () => ({
  collection: firebaseMocks.collection,
  onSnapshot: firebaseMocks.onSnapshot,
  setDoc: firebaseMocks.setDoc,
  doc: firebaseMocks.doc,
  deleteDoc: firebaseMocks.deleteDoc,
  updateDoc: firebaseMocks.updateDoc,
}));

const { useAuthStore } = await import('@/stores/auth.js');
const { useNotesStore } = await import('@/stores/notes.js');

describe('auth notes lifecycle', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    firebaseMocks.authStateCallback = null;
    vi.clearAllMocks();

    firebaseMocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      firebaseMocks.authStateCallback = callback;
      return vi.fn();
    });

    firebaseMocks.collection.mockImplementation((_db, ...path) => ({
      path,
    }));

    firebaseMocks.onSnapshot.mockImplementation(() => vi.fn());
  });

  it('starts notes when Firebase Auth resolves with a user', () => {
    const auth = useAuthStore();
    const notes = useNotesStore();
    auth.router = {
      push: vi.fn(),
      replace: vi.fn(),
    };
    const initNotes = vi.spyOn(notes, 'init').mockImplementation(() => {});
    const cleanNotes = vi.spyOn(notes, 'cleanNotes').mockImplementation(() => {});

    auth.init();
    firebaseMocks.authStateCallback({
      uid: 'user-123',
      email: 'person@example.com',
    });

    expect(auth.user).toEqual({
      id: 'user-123',
      email: 'person@example.com',
    });
    expect(auth.router.push).toHaveBeenCalledWith('/');
    expect(initNotes).toHaveBeenCalledTimes(1);
    expect(cleanNotes).not.toHaveBeenCalled();
  });

  it('clears notes when Firebase Auth resolves without a user', () => {
    const auth = useAuthStore();
    const notes = useNotesStore();
    auth.user = {
      id: 'previous-user',
      email: 'previous@example.com',
    };
    auth.router = {
      push: vi.fn(),
      replace: vi.fn(),
    };
    const initNotes = vi.spyOn(notes, 'init').mockImplementation(() => {});
    const cleanNotes = vi.spyOn(notes, 'cleanNotes').mockImplementation(() => {});

    auth.init();
    firebaseMocks.authStateCallback(null);

    expect(auth.user).toEqual({});
    expect(auth.router.replace).toHaveBeenCalledWith('/login');
    expect(cleanNotes).toHaveBeenCalledTimes(1);
    expect(initNotes).not.toHaveBeenCalled();
  });

  it('builds the notes collection path from the current auth user id', () => {
    const auth = useAuthStore();
    const notes = useNotesStore();
    auth.user = {
      id: 'user-456',
      email: 'person@example.com',
    };

    notes.init();

    expect(firebaseMocks.collection).toHaveBeenCalledWith(
      firebaseMocks.db,
      'users',
      'user-456',
      'notes',
    );
    expect(firebaseMocks.onSnapshot).toHaveBeenCalledWith(
      { path: ['users', 'user-456', 'notes'] },
      expect.any(Function),
    );
  });
});
