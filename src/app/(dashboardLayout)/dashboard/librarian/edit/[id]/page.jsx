import React from 'react';
import EditBookComponent from './EditBookComponent';
import { getBookById } from '@/lib/api/getBooks';

const EditBookPage = async ({params}) => {

  const {id} = await params;

  const book = await getBookById(id)

  return (
    <div>
      hi
      <EditBookComponent book={book} />
    </div>
  );
};

export default EditBookPage;