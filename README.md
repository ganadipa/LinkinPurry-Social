Apply init.sql

```bash
psql -U user -d db -h localhost -p 5433 -f ./backend/db/init.sql
```

(Ini untuk mastiin aja)
When the db server is on,

```
cd backend
npx prisma db pull
```

to create the schema.prisma
