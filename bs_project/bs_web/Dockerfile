FROM openjdk:17
ARG JAR_FILE=build/libs/bs_web.jar
COPY ${JAR_FILE} /bs_web.jar
ENTRYPOINT ["java","-jar","/bs_web.jar"]
