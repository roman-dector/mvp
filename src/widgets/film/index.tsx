import { FC } from "react"
import {
  Datagrid,
  List,
  Edit,
  SimpleForm,
  Create,
  TopToolbar,
  ListButton,
  TextField,
  Resource,
  TextInput,
  TransformData,
  EditButton,
  FieldProps,
  useRecordContext,
} from "react-admin"

const sort = { field: "name", order: "DESC" } as const

const AvgRating: FC<FieldProps> = props => {
  const record = useRecordContext(props)
  const avg = record.ratingValue / record.reviewCount

  return <span>{avg || 0}</span>
}

export const Films = () => (
  <List sort={sort} title={"Кинокартины"}>
    <Datagrid>
      <TextField source="name" label="Название" />
      {/* <TextField source="ratingValue" label="Средний рейтинг" /> */}
      <AvgRating label="Средний рейтинг" />
      <TextField source="reviewCount" label="Кол-во оценок" />
      <EditButton />
    </Datagrid>
  </List>
)

const FilmPostActions = (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
)

export const FilmEdit = () => (
  <Edit actions={FilmPostActions}>
    <SimpleForm>
      <TextInput source="name" label="Название" />
      <TextInput source="posterSrc" label="Постер" />
    </SimpleForm>
  </Edit>
)

const transformFilmCreateToServer: TransformData = data => {
  const report = data as { name: string }

  return {
    ...report,
    ratingValue: 0,
    reviewCount: 0,
  }
}

export const FilmCreate = () => {
  return (
    <Create
      transform={transformFilmCreateToServer}
      actions={FilmPostActions}
      redirect={"list"}
      title={"Добавление кинокартины"}
    >
      <SimpleForm>
        <TextInput source="name" label="Название" />
        <TextInput source="posterSrc" label="Постер" />
      </SimpleForm>
    </Create>
  )
}

export const filmResource = (
  <Resource
    name={"film"}
    list={Films}
    edit={FilmEdit}
    create={FilmCreate}
    recordRepresentation={"name"}
    options={{ label: "Кинокартины" }}
  />
)
