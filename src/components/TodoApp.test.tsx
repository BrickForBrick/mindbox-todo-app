// TodoApp.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoApp from './TodoApp';

describe('TodoApp', () => {
  beforeEach(() => {
    render(<TodoApp />);
  });

  describe('Initial render', () => {
    it('should render the todo input field', () => {
      const input = screen.getByTestId('new-todo-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'What needs to be done?');
    });

    it('should not show footer when no todos exist', () => {
      expect(screen.queryByTestId('todo-count')).not.toBeInTheDocument();
    });

    it('should render the title', () => {
      expect(screen.getByText('todos')).toBeInTheDocument();
    });
  });

  describe('Adding todos', () => {
    it('should add a new todo when typing and pressing Enter', async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('new-todo-input');
      
      await user.type(input, 'New todo item');
      await user.keyboard('{Enter}');
      
      expect(screen.getByText('New todo item')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should not add empty todos', async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('new-todo-input');
      
      await user.type(input, '   ');
      await user.keyboard('{Enter}');
      
      expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
    });

    it('should trim whitespace from new todos', async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('new-todo-input');
      
      await user.type(input, '  New todo  ');
      await user.keyboard('{Enter}');
      
      expect(screen.getByText('New todo')).toBeInTheDocument();
    });
  });

  describe('Todo interactions', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('new-todo-input');
      
      await user.type(input, 'First todo');
      await user.keyboard('{Enter}');
      await user.type(input, 'Second todo');
      await user.keyboard('{Enter}');
    });

    it('should toggle todo completion status', async () => {
      const user = userEvent.setup();
      const todoItems = screen.getAllByTestId('todo-item');
      const firstTodo = todoItems[0];
      const checkbox = firstTodo.querySelector('input[type="checkbox"]');
      
      expect(checkbox).not.toBeChecked();
      expect(firstTodo).not.toHaveClass('completed');
      
      await user.click(checkbox!);
      
      expect(checkbox).toBeChecked();
      expect(firstTodo).toHaveClass('completed');
    });

    it('should show correct active count', async () => {
      expect(screen.getByTestId('todo-count')).toHaveTextContent('2 items left');
      
      const user = userEvent.setup();
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1 item left');
    });
  });

  describe('Filtering', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('new-todo-input');
      
      // Add todos
      await user.type(input, 'Active todo');
      await user.keyboard('{Enter}');
      await user.type(input, 'Completed todo');
      await user.keyboard('{Enter}');
      
      // Complete second todo
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);
    });

    it('should show all todos by default', () => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });

    it('should filter active todos', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('filter-active'));
      
      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
    });

    it('should filter completed todos', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('filter-completed'));
      
      expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
      expect(screen.getByText('Completed todo')).toBeInTheDocument();
    });

    it('should highlight active filter button', async () => {
      const user = userEvent.setup();
      const activeButton = screen.getByTestId('filter-active');
      
      await user.click(activeButton);
      
      expect(activeButton).toHaveClass('selected');
      expect(screen.getByTestId('filter-all')).not.toHaveClass('selected');
    });
  });

  describe('Clear completed', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('new-todo-input');
      
      // Add todos
      await user.type(input, 'Active todo');
      await user.keyboard('{Enter}');
      await user.type(input, 'Completed todo 1');
      await user.keyboard('{Enter}');
      await user.type(input, 'Completed todo 2');
      await user.keyboard('{Enter}');
      
      // Complete some todos
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);
      await user.click(checkboxes[2]);
    });

    it('should show clear completed button when there are completed todos', () => {
      expect(screen.getByTestId('clear-completed')).toBeInTheDocument();
    });

    it('should remove completed todos when clicked', async () => {
      const user = userEvent.setup();
      
      expect(screen.getByText('Completed todo 1')).toBeInTheDocument();
      expect(screen.getByText('Completed todo 2')).toBeInTheDocument();
      
      await user.click(screen.getByTestId('clear-completed'));
      
      expect(screen.queryByText('Completed todo 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed todo 2')).not.toBeInTheDocument();
      expect(screen.getByText('Active todo')).toBeInTheDocument();
    });

    it('should hide clear completed button when no completed todos exist', async () => {
      const user = userEvent.setup();
      
      await user.click(screen.getByTestId('clear-completed'));
      
      expect(screen.queryByTestId('clear-completed')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      const user = userEvent.setup();
      const input = screen.getByTestId('new-todo-input');
      
      await user.type(input, 'Test todo');
      await user.keyboard('{Enter}');
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      
      const listItem = screen.getByTestId('todo-item');
      expect(listItem).toBeInTheDocument();
    });
  });
});

// Additional test utilities for complex scenarios
describe('TodoApp Integration Tests', () => {
  it('should handle complex user workflow', async () => {
    render(<TodoApp />);
    const user = userEvent.setup();
    const input = screen.getByTestId('new-todo-input');
    
    // Add multiple todos
    const todos = ['Buy groceries', 'Walk the dog', 'Finish project', 'Call mom'];
    
    for (const todo of todos) {
      await user.type(input, todo);
      await user.keyboard('{Enter}');
    }
    
    // Complete some todos
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]); // Complete first todo
    await user.click(checkboxes[2]); // Complete third todo
    
    // Check active count
    expect(screen.getByTestId('todo-count')).toHaveTextContent('2 items left');
    
    // Filter to show only completed
    await user.click(screen.getByTestId('filter-completed'));
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Finish project')).toBeInTheDocument();
    expect(screen.queryByText('Walk the dog')).not.toBeInTheDocument();
    
    // Clear completed todos
    await user.click(screen.getByTestId('clear-completed'));
    
    // Switch back to all filter
    await user.click(screen.getByTestId('filter-all'));
    
    // Check remaining todos
    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    expect(screen.queryByText('Finish project')).not.toBeInTheDocument();
    expect(screen.getByText('Call mom')).toBeInTheDocument();
    
    expect(screen.getByTestId('todo-count')).toHaveTextContent('2 items left');
  });
});