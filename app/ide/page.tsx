import SolidityIDE from '@/components/solidity-ide';
import { ErrorBoundary } from '@/components/error-boundary';

export default function IDEPage() {
  return (
    <ErrorBoundary>
      <SolidityIDE />
    </ErrorBoundary>
  );
}
