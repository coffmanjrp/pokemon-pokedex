import { render, screen } from '@testing-library/react'

// Simple test setup to verify Jest and React Testing Library work
describe('Test Environment Setup', () => {

  it('should render a basic component', () => {
    render(<div data-testid="test-component">Hello Test World</div>)
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
    expect(screen.getByText('Hello Test World')).toBeInTheDocument()
  })

  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2)
    expect('test').toBeTruthy()
    expect([]).toHaveLength(0)
  })
})