import { useCallback, useState, type ChangeEvent } from "react";

interface EditHandler<T> {
  handleEdit: (id: string, newName: T) => void;
  initialValue: T;
}

export function useClipEdit<T>({ handleEdit, initialValue }: EditHandler<T>) {
  const [isEditID, setIsEditID] = useState<string | null>(null);
  const [newName, setNewName] = useState<T>(initialValue);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value as unknown as T);
  }, []);

  const startEditing = useCallback((id: string, value: T) => {
    setIsEditID(id);
    setNewName(value);
  }, []);

  const saveEdit = useCallback(
    (id: string) => {
      handleEdit(id, newName);

      setIsEditID(null);
      setNewName(initialValue);
    },
    [handleEdit, newName, initialValue],
  );

  const cancelEdit = useCallback(() => {
    setIsEditID(null);
    setNewName(initialValue);
  }, [initialValue]);

  return {
    isEditID,
    newName,
    handleChange,
    startEditing,
    saveEdit,
    cancelEdit,
  };
}
