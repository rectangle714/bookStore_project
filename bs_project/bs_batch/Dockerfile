FROM openjdk:17
ARG JAR_FILE=build/libs/bs_batch.jar
COPY ${JAR_FILE} /bs_batch.jar
ENTRYPOINT ["java","-jar","/bs_batch.jar"]
