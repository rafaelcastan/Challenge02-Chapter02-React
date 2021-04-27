import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodsProps{
  id:number,
  name:string,
  description:string,
  price:number,
  available:boolean,
  image:string
}

const FoodInitialState = {
  id:0,
  name:'',
  description:'',
  price:0,
  available:false,
  image:''
}

function Dashboard () {
  const [foods,setFoods] = useState<FoodsProps[]>([{...FoodInitialState}]);
  const [editingFood, setEditingFood] = useState<FoodsProps>({...FoodInitialState});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(()=>{
    const GetFoods = async()=>{
    const response = await api.get('/foods');
    setFoods(response.data)
    }
    GetFoods();
  },[])

  const handleAddFood = (food:FoodsProps)=> {
    try {
      const getFoodsToAdd = async()=>{
        const response = await api.post('/foods', {
          ...food,
          available: true,
        });
        console.log(response.data)
        setFoods([...foods, response.data]);
      }
      getFoodsToAdd();
      
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = (food:FoodsProps) => {
    try {

      const updateFood = async() =>{
        const foodUpdated = await api.put(
          `/foods/${editingFood.id}`,
          { ...editingFood, ...food },
        );
  
        const foodsUpdated = foods.map(f =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data,
        );
  
        setFoods(foodsUpdated);
      } 

      updateFood();

    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = (id:number) => {

    const deleteFood = async()=>{
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);

      setFoods(foodsFiltered);
    }

    deleteFood();
  }

  const toggleModal = () => {

    setModalOpen(!modalOpen);

  }

  const toggleEditModal = () => {

   setEditModalOpen(!editModalOpen);

  }

  const handleEditFood = (food:FoodsProps) => {
    setEditingFood(food);
    toggleEditModal();
  }


    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  };

export default Dashboard;
