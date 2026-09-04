import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TodoItemDTO } from 'app/todo-item/todo-item-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    title: yup.string().emptyToNull().max(150).required(),
    description: yup.string().emptyToNull(),
    priority: yup.string().emptyToNull().max(20).required(),
    dueDate: yup.string().emptyToNull(),
    completed: yup.bool(),
    createdAt: yup.string().emptyToNull().offsetDateTime().required(),
    updatedAt: yup.string().emptyToNull().offsetDateTime(),
    category: yup.number().integer().emptyToNull()
  });
}

export default function TodoItemEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('todoItem.edit.headline'));

  const navigate = useNavigate();
  const [categoryValues, setCategoryValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const categoryValuesResponse = await axios.get('/api/todoItems/categoryValues');
      setCategoryValues(categoryValuesResponse.data);
      const data = (await axios.get('/api/todoItems/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateTodoItem = async (data: TodoItemDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/todoItems/' + currentId, data);
      navigate('/todoItems', {
            state: {
              msgSuccess: t('todoItem.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('todoItem.edit.headline')}</h1>
      <div>
        <Link to="/todoItems" className="btn btn-secondary">{t('todoItem.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateTodoItem)} noValidate>
      <InputRow useFormResult={useFormResult} object="todoItem" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="todoItem" field="title" required={true} />
      <InputRow useFormResult={useFormResult} object="todoItem" field="description" type="textarea" />
      <InputRow useFormResult={useFormResult} object="todoItem" field="priority" required={true} />
      <InputRow useFormResult={useFormResult} object="todoItem" field="dueDate" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="todoItem" field="completed" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="todoItem" field="createdAt" required={true} />
      <InputRow useFormResult={useFormResult} object="todoItem" field="updatedAt" />
      <InputRow useFormResult={useFormResult} object="todoItem" field="category" type="select" options={categoryValues} />
      <input type="submit" value={t('todoItem.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
