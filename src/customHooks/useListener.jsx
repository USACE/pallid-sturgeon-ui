import { useEffect, useRef } from 'react';

const useListener = (
  event,
  callback,
  listenerElement = window,
  options = {}
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e) => callbackRef.current(e);
    listenerElement &&
      listenerElement.addEventListener(event, handler, options);
    return () =>
      listenerElement &&
      listenerElement.removeEventListener(event, handler, options);
  }, [event, listenerElement, options]);
};

export default useListener;
