import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from "./app";
import Home from './home/home';
import CategoryList from './category/category-list';
import CategoryAdd from './category/category-add';
import CategoryEdit from './category/category-edit';
import TodoItemList from './todo-item/todo-item-list';
import TodoItemAdd from './todo-item/todo-item-add';
import TodoItemEdit from './todo-item/todo-item-edit';
import Error from './error/error';


export default function AppRoutes() {
  const router = createBrowserRouter([
    {
      element: <App />,
      children: [
        { path: '', element: <Home /> },
        { path: 'categories', element: <CategoryList /> },
        { path: 'categories/add', element: <CategoryAdd /> },
        { path: 'categories/edit/:id', element: <CategoryEdit /> },
        { path: 'todoItems', element: <TodoItemList /> },
        { path: 'todoItems/add', element: <TodoItemAdd /> },
        { path: 'todoItems/edit/:id', element: <TodoItemEdit /> },
        { path: 'error', element: <Error /> },
        { path: '*', element: <Error /> }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}
