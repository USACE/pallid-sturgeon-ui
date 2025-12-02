import { useEffect, useMemo, useState } from 'react';
import { db } from './db';

export function useMoRiverDraft(clientId) {
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    (async () => {
      const row = await db.moriver.get(clientId);
      if (!cancelled) {
        setDraft(row || { clientId, _status: 'draft', version: 0 });
        setStatus(row?._status || 'draft');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const saveField = useMemo(() => {
    let t = null;
    return (patch) => {
      setDraft((prev) => {
        const next = { ...(prev || { clientId, _status: 'draft', version: 0 }), ...patch };
        clearTimeout(t);
        t = setTimeout(async () => {
          await db.moriver.put(next);
          setStatus(next._status || 'draft');
        }, 150);
        return next;
      });
    };
  }, [clientId]);

  const bind = (name) => ({
    value: draft?.[name] ?? '',
    onChange: (e) => {
      const v = e?.target ? e.target.value : e;
      saveField({ [name]: v });
    },
  });

  return { draft, status, setDraft, bind, saveField };
}
