import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { TodoItemDTO } from 'app/todo-item/todo-item-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function TodoItemList() {
  const { t } = useTranslation();
  useDocumentTitle(t('todoItem.list.headline'));

  const [todoItems, setTodoItems] = useState<TodoItemDTO[]>([]);
  const navigate = useNavigate();

  const getAllTodoItems = async () => {
    try {
      const response = await axios.get('/api/todoItems');
      setTodoItems(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/todoItems/' + id);
      navigate('/todoItems', {
            state: {
              msgInfo: t('todoItem.delete.success')
            }
          });
      getAllTodoItems();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllTodoItems();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('todoItem.list.headline')}</h1>
      <div>
        <Link to="/todoItems/add" className="btn btn-primary ms-2">{t('todoItem.list.createNew')}</Link>
      </div>
    </div>
    {!todoItems || todoItems.length === 0 ? (
    <div>{t('todoItem.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('todoItem.id.label')}</th>
            <th scope="col">{t('todoItem.title.label')}</th>
            <th scope="col">{t('todoItem.priority.label')}</th>
            <th scope="col">{t('todoItem.dueDate.label')}</th>
            <th scope="col">{t('todoItem.completed.label')}</th>
            <th scope="col">{t('todoItem.createdAt.label')}</th>
            <th scope="col">{t('todoItem.updatedAt.label')}</th>
            <th scope="col">{t('todoItem.category.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {todoItems.map((todoItem) => (
          <tr key={todoItem.id}>
            <td>{todoItem.id}</td>
            <td>{todoItem.title}</td>
            <td>{todoItem.priority}</td>
            <td>{todoItem.dueDate}</td>
            <td>{todoItem.completed?.toString()}</td>
            <td>{todoItem.createdAt}</td>
            <td>{todoItem.updatedAt}</td>
            <td>{todoItem.category}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/todoItems/edit/' + todoItem.id} className="btn btn-sm btn-secondary">{t('todoItem.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(todoItem.id!)} className="btn btn-sm btn-secondary">{t('todoItem.list.delete')}</button>
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
  </>);
}
