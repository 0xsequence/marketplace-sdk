import { type ReactNode, useCallback, useEffect, useRef } from 'react';

interface ModalShellProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

const FOCUSABLE_SELECTOR =
	'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement | null) {
	if (!container) return [];
	return Array.from(
		container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
	);
}

export function ModalShell({
	title,
	isOpen,
	onClose,
	children,
}: ModalShellProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	const trapFocus = useCallback((event: KeyboardEvent) => {
		if (event.key !== 'Tab' || !modalRef.current) return;

		const focusableElements = getFocusableElements(modalRef.current);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement?.focus();
		} else if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement?.focus();
		}
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
				return;
			}
			trapFocus(event);
		},
		[onClose, trapFocus],
	);

	useEffect(() => {
		if (!isOpen) return;

		previousActiveElement.current = document.activeElement as HTMLElement;
		document.addEventListener('keydown', handleKeyDown);
		document.body.style.overflow = 'hidden';

		const focusTimer = setTimeout(() => {
			const focusableElements = getFocusableElements(modalRef.current);
			focusableElements[0]?.focus();
		}, 0);

		return () => {
			clearTimeout(focusTimer);
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
			previousActiveElement.current?.focus();
		};
	}, [isOpen, handleKeyDown]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div
				className="absolute inset-0 bg-black/60"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div
				ref={modalRef}
				className="relative w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6"
			>
				<div className="mb-4 flex items-center justify-between">
					<h2 id="modal-title" className="font-semibold text-lg text-white">
						{title}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 text-xl hover:text-white"
						aria-label="Close modal"
						type="button"
					>
						&times;
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
