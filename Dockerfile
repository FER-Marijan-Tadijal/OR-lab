FROM postgres:15-alpine
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB ORbaza
COPY ORbazaDump.sql /docker-entrypoint-initdb.d/