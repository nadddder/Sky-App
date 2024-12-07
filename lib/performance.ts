// src/lib/performance.ts
import { useCallback, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }) as T,
        [callback, delay]
    );
}

export function useInteractionCallback(callback: () => void) {
    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(callback);
        return () => task.cancel();
    }, [callback]);
}

export function useUpdateEffect(
    effect: () => void | (() => void),
    deps: React.DependencyList
) {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        return effect();
    }, deps);
}

export function useWhyDidYouUpdate(name: string, props: Record<string, unknown>) {
    if (__DEV__) {
        const previousProps = useRef<Record<string, unknown>>();

        useEffect(() => {
            if (previousProps.current) {
                const allKeys = Object.keys({ ...previousProps.current, ...props });
                const changesObj: Record<string, { from: unknown; to: unknown }> = {};

                allKeys.forEach(key => {
                    const prevValue = previousProps.current?.[key];
                    const currentValue = props[key];

                    if (prevValue !== currentValue) {
                        changesObj[key] = {
                            from: prevValue,
                            to: currentValue
                        };
                    }
                });

                if (Object.keys(changesObj).length) {
                    console.log('[why-did-you-update]', name, changesObj);
                }
            }

            previousProps.current = props;
        });
    }
}